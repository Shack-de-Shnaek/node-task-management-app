const calculateTextColor = (color: string) => {
    color = color.replace('#', '');

    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4), 16);
    
    const [lumR, lumG, lumB] = [r, g, b].map(component => {
        let proportion = component / 255;

        return proportion <= 0.03928 ? proportion / 12.92 : Math.pow((proportion + 0.055) / 1.055, 2.4);
    });

    const l1 = 0.2126 * lumR + 0.7152 * lumG + 0.0722 * lumB;

    const lDarkText = 0.0180656421;
    const lLightText = 0.946099497;

    if ((l1 + 0.05) / (lDarkText + 0.05) >= (lLightText + 0.05) / (l1 + 0.05)) return 'var(--bs-dark)';
    else return 'var(--bs-light)';
}

export default calculateTextColor;