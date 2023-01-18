const parseParagraphs = (text: string) => {
    text.replaceAll('\\n', '\n');
    const paragraphs: string[] = [];
    let currentParagraph = '';
    for (let i = 0; i < text.length; i++) {
        currentParagraph += text[i];
        if (text[i] === '\n' || i === text.length - 1) {
            paragraphs.push(currentParagraph);
            currentParagraph = '';
            continue;
        }
    }
    return paragraphs;
}

export default parseParagraphs;