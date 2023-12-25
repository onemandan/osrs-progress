class Tile {
    constructor(id, requirements, html, onClick, primary, secondary, element) {
        this.id = id;
        this.requirements = requirements;
        this.html = html;
        this.onClick = onClick;
        this.primary = primary;
        this.secondary = secondary;
        this.element = element;
    }

    init() {
        if (!this.element) {
            this.element = $(this.html);
        }
        
        $(this.element).on('click', this.click.bind(this));

        return this;
    }

    click(event) {
        $(event.currentTarget).toggleClass('_active');
        $(event.currentTarget).toggleClass('_inactive');

        if (this.onClick) {
            this.onClick(this.id);
        }
    }
}

export function TileFactory(id, requirements, html, onClick, primary, secondary = null, element = null) {
    const tile = new Tile(id, requirements, html, onClick, primary, secondary, element);
    return tile.init();
}