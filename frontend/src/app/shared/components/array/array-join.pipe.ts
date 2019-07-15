import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'arrayJoin'
})

export class ArrayJoinPipe implements PipeTransform {
    transform(value: any, separator = ', ', key: string): any {
        if (!value) {
            return '';
        }

        return value
            .map(i => {
                if (key) {
                    return i[key];
                }

                return i;
            })
            .join(separator);
    }
}