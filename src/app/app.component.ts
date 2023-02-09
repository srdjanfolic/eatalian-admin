import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './demo/components/auth/login/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(
        private primengConfig: PrimeNGConfig,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.primengConfig.setTranslation({
            startsWith: "Počinje sa",
            contains: "Sadrži",
            notContains: "Ne sadrži",
            endsWith: "Završava sa",
            equals: "Jednako",
            notEquals: "Nije",
            noFilter: "Ukloni filter",
            lt: "Manje",
            lte: "Manje jednako",
            gt: "Veće",
            gte: "Veće jednako",
            is: "je",
            isNot: "nije",
            before: "prije",
            after: "posle",
            dateIs: "je",
            dateIsNot: "nije",
            dateBefore: "prije",
            dateAfter: "nakon",
            clear: "Očisti",
            apply: "Primijeni",
            matchAll: "Svi uslovi",
            matchAny: "Neki od uslova",
            addRule: "Dodaj uslov",
            removeRule: "Ukloni uslov",
            accept: "Prihvati",
            reject: "Odbij",
            choose: "Izaberi",
            upload: "Upload",
            cancel: "Otkaži",
            dayNames: ["Nedelja", "Ponedeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"], 
            dayNamesShort: ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"], 
            dayNamesMin: ["N","P", "U", "S", "Č", "P", "S"], 
            monthNames: ["Januar","Februar","Mart","April","Maj","Jun","Jul","Avgust","Septembar","Oktobar","Novembar","Decembar"],
            monthNamesShort: ["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Avg","Sep","Okt","Nov","Dec"],
            //dateFormat: "",
            firstDayOfWeek: 1,
            today: "Danas",
            //weekHeader: "",
            weak: "Slab",
            medium: "Srednji",
            strong: "Jak",
            passwordPrompt: "Unesi pass",
            emptyMessage: "Očisti",
            emptyFilterMessage: "Očisti",
        });
        this.authService.autoSignIn();
    }
}
