class Skills {
    constructor(onClick) {
        this.onClick = onClick;

        this.selectors = {
            items: '#skills-wrapper>div',
            activeItems: '#skills-wrapper>div._active',
            progress: '#skills-progress'
        };
    }

    init(completed) {
        $(this.selectors.items).each((index, element) => {
            if (completed.includes($(element).find('._id').text())) {
                $(element).addClass('_active');
                $(element).removeClass('_inactive');
            }
        });

        $(this.selectors.items).on('click', (event) => {
            $(event.currentTarget).toggleClass('_active');
            $(event.currentTarget).toggleClass('_inactive');

            this.onClick($(event.currentTarget).find('._id').text());
            this.updateProgress();
        });

        this.updateProgress();
        return this;
    }

    updateProgress() {
        $(this.selectors.progress).text($(this.selectors.activeItems).length);
    }
}

export function SkillsFactory(onClick, completed) {
    const skills = new Skills(onClick);
    return skills.init(completed);
}