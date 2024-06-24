export async function fetchRandomText() {
    try {
        const response = await fetch('https://poetrydb.org/random/1/lines.json');
        const data = await response.json();
        let text = data[0].lines.join(' ');
        if (text.length > 700) {
            text = text.substring(0, 700);
            text = text.substring(0, text.lastIndexOf(' ')) + '...';
        } else if (text.length < 700) {
            while (text.length < 700) {
                text += ' ' + text;  // Repeat the text until it reaches at least 300 characters
            }
            text = text.substring(0, 700);
            text = text.substring(0, text.lastIndexOf(' ')) + '...';
        }
        return text;
    } catch (error) {
        console.error('Error fetching text:', error);
        return 'Failed to load text.';
    }
}