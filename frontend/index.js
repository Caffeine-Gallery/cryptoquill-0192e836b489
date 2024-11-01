import { backend } from "declarations/backend";

let quill;

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Feather icons
    feather.replace();

    // Initialize Quill editor
    quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });

    // Event Listeners
    document.getElementById('newPostBtn').addEventListener('click', showPostForm);
    document.getElementById('cancelBtn').addEventListener('click', hidePostForm);
    document.getElementById('createPostForm').addEventListener('submit', handleSubmit);

    // Load initial posts
    await loadPosts();
});

async function loadPosts() {
    showLoading();
    try {
        const posts = await backend.getPosts();
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = posts.map(post => createPostHTML(post)).join('');
        feather.replace();
    } catch (error) {
        console.error('Error loading posts:', error);
    }
    hideLoading();
}

function createPostHTML(post) {
    const date = new Date(Number(post.timestamp / 1000000n));
    return `
        <article class="post">
            <h2>${post.title}</h2>
            <div class="post-meta">
                <span><i data-feather="user"></i> ${post.author}</span>
                <span><i data-feather="calendar"></i> ${date.toLocaleDateString()}</span>
            </div>
            <div class="post-content">
                ${post.body}
            </div>
        </article>
    `;
}

function showPostForm() {
    document.getElementById('postForm').classList.remove('hidden');
}

function hidePostForm() {
    document.getElementById('postForm').classList.add('hidden');
    document.getElementById('createPostForm').reset();
    quill.setContents([]);
}

function showLoading() {
    document.getElementById('loadingSpinner').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.add('hidden');
}

async function handleSubmit(e) {
    e.preventDefault();
    showLoading();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const body = quill.root.innerHTML;

    try {
        await backend.createPost(title, body, author);
        hidePostForm();
        await loadPosts();
    } catch (error) {
        console.error('Error creating post:', error);
    }
    hideLoading();
}
