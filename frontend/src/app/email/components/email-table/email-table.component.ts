import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { Email } from '../../models/email';

@Component({
    selector: 'email-table',
    templateUrl: 'email-table.component.html',
    styleUrls: ['./email-table.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EmailTableComponent implements OnInit {
    @Input() items: Email[] = [];
    @Input() selectedItems: string[] = [];

    @Output() selectedItemsChange = new EventEmitter();
    @Output() downloadEmail = new EventEmitter();
    @Output() showEmailSource = new EventEmitter();
    @Output() deleteEmail = new EventEmitter();
    @Output() tag = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    isChecked(id: string): boolean {
        return this.selectedItems && this.selectedItems.includes(id);
    }

    rowCheck(event: MouseEvent, id: string) {
        event.stopPropagation();
        const checked = this.isChecked(id);
        if (checked) {
            this.selectedItems = this.selectedItems.filter((item: string) => item !== id);
        } else {
            this.selectedItems.push(id);
        }

        this.selectedItemsChange.next(this.selectedItems);
    }

    isAllChecked(): boolean {
        return this.items && this.items.length && this.items.length === this.selectedItems.length;
    }

    allItemsCheck(event: any) {
        if (event.target.checked) {
            this.selectedItems = this.items.map(i => i.id);
        } else {
            this.selectedItems = [];
        }

        this.selectedItemsChange.next(this.selectedItems);
    }

    downloadEmailClick(event: MouseEvent, id: string) {
        event.stopPropagation();
        this.downloadEmail.next(id);
    }

    showEmailSourceClick(event: MouseEvent, id: string) {
        event.stopPropagation();
        this.showEmailSource.next(id);
    }

    deleteEmailClick(event: MouseEvent, id: string) {
        event.stopPropagation();
        this.deleteEmail.next(id);
    }

    tagClick(event: MouseEvent, tag: string) {
        event.stopPropagation();
        this.tag.next(tag);
    }
}