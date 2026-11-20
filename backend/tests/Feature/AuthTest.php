<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // These tests exercise validation/authentication, not the rate limiter.
        $this->withoutMiddleware(ThrottleRequests::class);
    }

    private function registration(array $overrides = []): array
    {
        return array_merge([
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'password123',
        ], $overrides);
    }

    public function test_user_can_register_and_receives_a_token(): void
    {
        $response = $this->postJson('/api/register', $this->registration());

        $response->assertCreated()
            ->assertJsonPath('message', 'Registration successful.')
            ->assertJsonPath('user.username', 'testuser')
            ->assertJsonPath('user.email', 'test@example.com')
            ->assertJsonStructure(['message', 'user' => ['id', 'username', 'email'], 'token']);

        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
        $this->assertDatabaseHas('personal_access_tokens', ['tokenable_id' => $response->json('user.id')]);
    }

    public function test_registration_requires_all_fields(): void
    {
        $this->postJson('/api/register', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['username', 'email', 'password']);
    }

    public function test_registration_rejects_invalid_email(): void
    {
        $this->postJson('/api/register', $this->registration(['email' => 'not-an-email']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_registration_rejects_duplicate_username_and_email(): void
    {
        $this->postJson('/api/register', $this->registration())->assertCreated();

        $this->postJson('/api/register', $this->registration())
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['username', 'email']);
    }

    public function test_registration_hashes_password_and_ignores_privileged_input(): void
    {
        $response = $this->postJson('/api/register', $this->registration(['role' => 'admin', 'is_admin' => true]));
        $response->assertCreated();

        $user = User::findOrFail($response->json('user.id'));

        $this->assertTrue(Hash::check('password123', $user->password));
        $this->assertNotEquals('password123', $user->password);
        $this->assertArrayNotHasKey('role', $response->json('user'));
        $this->assertArrayNotHasKey('is_admin', $response->json('user'));
    }

    public function test_user_can_login_with_username_or_email(): void
    {
        $this->postJson('/api/register', $this->registration())->assertCreated();

        $byUsername = $this->postJson('/api/login', [
            'login' => 'testuser',
            'password' => 'password123',
        ]);
        $byUsername->assertOk()
            ->assertJsonPath('message', 'Login successful.')
            ->assertJsonPath('user.username', 'testuser')
            ->assertJsonStructure(['token']);

        $byEmail = $this->postJson('/api/login', [
            'login' => 'test@example.com',
            'password' => 'password123',
        ]);
        $byEmail->assertOk()->assertJsonPath('user.email', 'test@example.com');
    }

    public function test_login_requires_both_fields(): void
    {
        $this->postJson('/api/login', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['login', 'password']);
    }

    public function test_login_rejects_bad_credentials_without_revealing_the_account(): void
    {
        $this->postJson('/api/register', $this->registration())->assertCreated();

        $unknownEmail = $this->postJson('/api/login', [
            'login' => 'nobody@example.com',
            'password' => 'password123',
        ]);
        $wrongPassword = $this->postJson('/api/login', [
            'login' => 'testuser',
            'password' => 'wrongpassword',
        ]);

        $unknownEmail->assertUnprocessable()->assertJsonValidationErrors('login');
        $wrongPassword->assertUnprocessable()->assertJsonValidationErrors('login');
        $this->assertSame(
            $unknownEmail->json('errors.login.0'),
            $wrongPassword->json('errors.login.0'),
        );
    }

    public function test_protected_routes_reject_unauthenticated_requests(): void
    {
        $this->getJson('/api/me')->assertUnauthorized();
        $this->getJson('/api/posts')->assertUnauthorized();
    }

    public function test_token_grants_access_and_logout_revokes_it(): void
    {
        $token = $this->postJson('/api/register', $this->registration())->json('token');

        $this->withToken($token)->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('username', 'testuser');

        $this->withToken($token)->postJson('/api/logout')->assertOk();

        // The test app reuses one guard instance; real requests are fresh processes.
        auth()->forgetGuards();

        $this->withToken($token)->getJson('/api/me')->assertUnauthorized();
    }
}
