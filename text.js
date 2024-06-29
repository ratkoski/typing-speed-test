export async function fetchRandomText() {
    try {
        const response = await fetch('https://poetrydb.org/random/1/lines.json');
        const data = await response.json();
        let text = data[0].lines.join(' ');
        if (text.length > 1300) {
            text = text.substring(0, 1300);
            text = text.substring(0, text.lastIndexOf(' ')) + '...';
        } else if (text.length < 1300) {
            while (text.length < 1300) {
                text += ' ' + text;
            }
            text = text.substring(0, 1300);
            text = text.substring(0, text.lastIndexOf(' ')) + '...';
        }
        return text;
    } catch (error) {
        console.error('Error fetching text:', error);
        return 'Failed to load text.';
    }
}