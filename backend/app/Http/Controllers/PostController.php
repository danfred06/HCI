<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    // GET /api/posts — paginated feed
    public function index()
    {
        return Post::with('user:id,username,avatar')
            ->latest()
            ->paginate(10);
    }

    // POST /api/posts — "What's on your mind?" + optional image
    public function store(Request $request)
    {
        $data = $request->validate([
            'content' => 'nullable|string|max:2000',
            'image' => 'nullable|image|max:4096',
        ]);

        if (empty($data['content']) && ! $request->hasFile('image')) {
            return response()->json(['message' => 'Write something or add an image.'], 422);
        }

        $post = $request->user()->posts()->create([
            'content' => $data['content'] ?? null,
            'image' => $request->hasFile('image')
                ? $request->file('image')->store('posts', 'public')
                : null,
        ]);

        return response()->json($post->load('user:id,username,avatar'), 201);
    }

    // DELETE /api/posts/{post} — only the author may delete
    public function destroy(Request $request, Post $post)
    {
        abort_if($post->user_id !== $request->user()->id, 403);

        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
