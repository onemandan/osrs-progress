export class Section {
    constructor(data) {
        this.imagesURL = 'https://oldschool.runescape.wiki/images/';
        this.data = data;
    }

    getAvailable(fUnlocked, fSort) {
        const available = [];

        for(const key of Object.keys(this.data)) {
            if (fUnlocked(this.data[key].requirements)) {
                available.push(this.data[key]);
            }
        }

        return available.sort(fSort);
    }
}