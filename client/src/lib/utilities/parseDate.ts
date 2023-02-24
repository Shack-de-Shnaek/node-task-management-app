const parseDate = (dateString) => {
    const date = new Date(dateString);
    // return `${date.getDay()+1}.${date.getMonth()+1}.${date.getFullYear()}`
    return date.toLocaleDateString('en-GB', {
        dateStyle: 'long'
    });
}

export default parseDate;