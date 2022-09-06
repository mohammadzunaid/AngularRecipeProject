import { Injectable } from '@angular/core';

export class LoggingService{
    lastLoaded: string;

    printLog(message: string){
        console.log(message);
        console.log(this.lastLoaded);
        this.lastLoaded=message;
    }
}