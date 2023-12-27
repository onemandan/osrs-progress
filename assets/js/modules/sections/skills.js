class Skills {
    constructor(onClick) {
        this.onClick = onClick;

        this.selectors = {
            items: '#skills-wrapper>div',
            activeItems: '#skills-wrapper>div._active>._id:not(:contains("Combat"))',
            progress: '#skills-progress'
        };
    }

    //init
    //Initialise skill items status (_active, _inactive) based on @completed and set click event handlers
    //@complete - localStorage completed skills object
    init(completed) {
        $(this.selectors.items).each((index, element) => {
            if (completed.includes($(element).find('._id').text())) {
                $(element).addClass('_active');
                $(element).removeClass('_inactive');
            }
        });

        //Skills items click event handler
        $(this.selectors.items).on('click', (event) => {

            //Toggle _active and _inactive classes to visually update items
            $(event.currentTarget).toggleClass('_active');
            $(event.currentTarget).toggleClass('_inactive');

            //Item click callback with skill name
            this.onClick($(event.currentTarget).find('._id').text());
            this.updateProgress();
        });

        this.updateProgress();
        return this;
    }


    //updateProgress
    //Update the skill progress count
    updateProgress() {
        $(this.selectors.progress).text($(this.selectors.activeItems).length);
    }
}

export function SkillsFactory(onClick, completed) {
    const skills = new Skills(onClick);
    return skills.init(completed);
}