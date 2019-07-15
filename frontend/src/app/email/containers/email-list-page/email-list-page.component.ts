import { Component, OnInit } from '@angular/core';
import { EmailService } from '../../email.service';
import { BsModalService } from 'ngx-bootstrap';
import { EmailSourceComponent } from '../../components/email-source/email-source.component';

@Component({
    selector: 'app-email-list',
    templateUrl: './email-list-page.component.html',
    styleUrls: ['./email-list-page.component.css']
})
export class EmailListPageComponent implements OnInit {
    pagination = {
        maxSize: 10,
        limit: 30,
        currentPage: 1
    };
    data = {
        items: [],
        count: 0
    };
    searchQuery = '';
    selectedItems: string[] = [];

    constructor(
        private email: EmailService,
        private modalService: BsModalService
    ) { }

    ngOnInit() {
        this.getData();
    }

    getData() {
        let params = {
            limit: this.pagination.limit,
            skip: this.pagination.limit * (this.pagination.currentPage - 1),
            query: this.searchQuery
        };

        this.email.getList(params).subscribe(response => {
            this.selectedItems = [];
            Object.assign(this.data, response);
        });
    }

    pageChanged(event) {
        this.pagination.currentPage = event.page;
        this.getData();
    }

    searchQueryChange(query: string) {
        this.searchQuery = query;
        this.getData();
    }

    downloadEmailClick(id: string) {
        this.email.downloadEmail(id).subscribe();
    }

    showEmailSource(id: string) {
        this.email
            .getEmailSource(id)
            .subscribe((response) => this.modalService.show(EmailSourceComponent, {
                class: 'modal-lg',
                initialState: {
                    source: response
                }
            }));
    }

    deleteEmailClick(id: string) {
        if (!confirm('Would like to delete email?')) {
            return;
        }

        this.email
            .delete(id)
            .subscribe(() => this.getData());
    }

    deleteSelectedItemsClick() {
        if (!confirm('Would like to delete selected emails?')) {
            return;
        }

        if (!this.selectedItems.length) {
            return;
        }

        this.email.deleteMultiple(this.selectedItems).subscribe(() => this.getData());
    }

    tagClick(tag: string) {
        this.searchQueryChange(tag);
    }
}
