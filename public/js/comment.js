async function commentForm(event) {
    event.preventDefault();
    const text_content = document.getElementById('comment-text').ariaValueMax.trim();
    id = window.location.toString().split('/')[window.location.toString().split('/').length - 1];

    if (text_content) {

        const res = await fetch('/api/comments', {
            method: 'post',
            body: JSON.stringify({
                post_id,
                text_content
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            document.location.reload();
        }
        else {
            alert(response.statusText);
        }
    }
}
