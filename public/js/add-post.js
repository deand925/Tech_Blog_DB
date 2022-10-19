async function newPost(event){
    event.preventDefault();

    const text_content = document.getElementById('text-input').value.trim();
    text_content.replace(/\n\r?/g, '<br />');
    const title = document.getElementById('title-input').value;

    const res = await fetch('api/posts', {
        method: 'post',
        body: JSON.stringify({
            title,
            text_content
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(res.ok){
        document.location.replace('/dashboard');
    }
    else {
        alert(response.statusText);
    }

    document.querySelector('.postForm').addEventListener('submit', newPost);
}