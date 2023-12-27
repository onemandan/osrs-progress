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

    //getAvailable
    //Returns a sorted array of unlocked @data items and updates @progress counts
    //@fUnlocked - callback function to obtain item unlock status
    //@completed - completed localStorage object
    //@fSort - sort comparison function
    //@completedKey - key to use for the @completed object
    getAvailable(fUnlocked, completed, fSort, completedKey) {
        const available = [];

        //Reset progress counts
        this.progress.complete = 0;
        this.progress.total = 0;

        for(const key of Object.keys(this.data)) {
            const obj = this.data[key];

            //Add data item and update counts if unlocked
            if (fUnlocked(obj.requirements)) {
                obj.active = completed.includes(obj[completedKey]);
                available.push(obj);
                
                this.progress.complete += (+obj.active);
                this.progress.total++;
            }
        }

        return available.sort(fSort);
    }

    //onItemClick
    //Toggles item active status
    //@event - click event target
    onItemClick(event) {
        $(event.currentTarget).toggleClass('_active');
        $(event.currentTarget).toggleClass('_inactive');

        //Item click callback with item id
        this.onClick($(event.currentTarget).find('._id').text());
    }

    //updateProgress
    //Updates progress elements with @progress counts
    //@selectors - element CSS selectors to update
    updateProgress(selectors) {

        //Update total, complete and incomplete progress counts
        $(selectors.total).text(this.progress.total);
        $(selectors.complete).text(this.progress.complete);
        $(selectors.incomplete).text(this.progress.total - this.progress.complete);

        //Update progress bar width
        $(selectors.bar).css('width', `${(this.progress.complete / this.progress.total) * 100}%`);
    }
}