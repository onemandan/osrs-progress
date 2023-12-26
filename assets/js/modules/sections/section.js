export class Section {
    constructor(data, onClick) {
        this.imagesURL = 'https://oldschool.runescape.wiki/images/';
        this.data = data;
        this.onClick = onClick;

        this.onItemClick = this.onItemClick.bind(this);
    }

    getAvailable(fUnlocked, completed, fSort, completedKey) {
        const available = [];

        for(const key of Object.keys(this.data)) {
            const obj = this.data[key];

            if (fUnlocked(obj.requirements)) {
                obj.active = completed.includes(obj[completedKey]);
                available.push(obj);
            }
        }

        return available.sort(fSort);
    }

    onItemClick(event) {
        $(event.currentTarget).toggleClass('_active');
        $(event.currentTarget).toggleClass('_inactive');

        this.onClick($(event.currentTarget).find('._id').text());
    }
}