const parseFileSize = (size: number) => {
    if (size >= 1000000) return `${(size / 1000000).toFixed(1)}MB`;
    if (size >= 1000) return `${(size / 1000).toFixed(1)}KB`
}

export default parseFileSize;