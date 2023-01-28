const parseParagraphs = (text: string, maxLength:number=null) => {
    text.replaceAll('\\n', '\n');
    const paragraphs: string[] = [];
    let currentParagraph = '';
    const max = maxLength !== null ? Math.min(text.length, maxLength) : text.length;
    for (let i = 0; i < max; i++) {
        currentParagraph += text[i];
        if (max < text.length && i === max - 1) currentParagraph += '...';
        if (text[i] === '\n' || i === max - 1) {
            paragraphs.push(currentParagraph);
            currentParagraph = '';
            continue;
        }
    }
    return paragraphs;
}

export default parseParagraphs;