document.getElementById('dns-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const domain = document.getElementById('domain').value.trim();
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = 'Resolving...';
    try {
        // Using Cloudflare DNS over HTTPS API
        const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`, {
            headers: {
                'accept': 'application/dns-json'
            }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (data.Answer && data.Answer.length > 0) {
            const ips = data.Answer.filter(a => a.type === 1).map(a => a.data);
            resultDiv.textContent = `IP Address(es): ${ips.join(', ')}`;
        } else {
            resultDiv.textContent = 'No A record found for this domain.';
        }
    } catch (err) {
        resultDiv.textContent = 'Error: ' + err.message;
    }
});
