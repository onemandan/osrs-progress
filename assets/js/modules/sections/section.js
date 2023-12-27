export class Section {
    constructor(data, onClick) {
        this.imagesURL = 'https://oldschool.runescape.wiki/images/';
        this.data = data;
        this.onClick = onClick;

        this.progress = {
            total: 0,
            complete: 0
        };
    }

    getAvailable(fUnlocked, completed, fSort, completedKey) {
        const available = [];

        this.progress.complete = 0;
        this.progress.total = 0;

        for(const key of Object.keys(this.data)) {
            const obj = this.data[key];

            if (fUnlocked(obj.requirements)) {
                obj.active = completed.includes(obj[completedKey]);
                available.push(obj);
                
                this.progress.complete += (+obj.active);
                this.progress.total++;
            }
        }

        return available.sort(fSort);
    }

    onItemClick(event) {
        $(event.currentTarget).toggleClass('_active');
        $(event.currentTarget).toggleClass('_inactive');

        this.onClick($(event.currentTarget).find('._id').text());
    }

    updateProgress(selectors) {
        $(selectors.total).text(this.progress.total);
        $(selectors.complete).text(this.progress.complete);
        $(selectors.incomplete).text(this.progress.total - this.progress.complete);

        $(selectors.bar).css('width', `${(this.progress.complete / this.progress.total) * 100}%`);
    }
}