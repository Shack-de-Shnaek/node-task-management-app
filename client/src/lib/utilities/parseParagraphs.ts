const parseParagraphs = (text: string, maxLength:number=null) => {
    const value = text.replaceAll('\\n', '\n');
    const paragraphs: string[] = [];
    let currentParagraph = '';
    const max = maxLength !== null ? Math.min(text.length, maxLength) : value.length;
    for (let i = 0; i < max; i++) {
        currentParagraph += value[i];
        if (max < value.length && i === max - 1) currentParagraph += '...';
        if (value[i] === '\n' || i === max - 1) {
            paragraphs.push(currentParagraph);
            currentParagraph = '';
            continue;
        }
    }
    return paragraphs;
}

export default parseParagraphs;