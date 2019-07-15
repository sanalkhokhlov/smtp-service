import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'email-source',
    template: `
        <div class="modal-header">
            <h4 class="modal-title pull-left"></h4>
            <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <span class="source">{{source}}</span>
        </div>
    `,
    styles: ['.source { white-space: pre-line; }']
})
export class EmailSourceComponent implements OnInit {
    constructor(public bsModalRef: BsModalRef) { }
    source = '';

    ngOnInit() { }
}