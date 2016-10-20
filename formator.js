/**
 * Formator.js 1.1, ett lättviktigt bibliotek för att validera och formatera 
 * olika typer av formulärsdata. Biblioteket är särskilt användbart för 
 * registrering av kundkonton och vid utcheckning i kassor på e-handelssidor.
 * 
 * https://github.com/jop-io/formator.js
 * 
 * Biblioteket har stöd för följande typer av formulärsdata:
 * 
 *  - Svenska mobiltelefonnummer
 *  - Svenska personnummer
 *  - Svenska organisationsnummer
 *  - Svenska momsregistreringsnummer
 *  - Svenska postnummer
 *  - Bankkortsnummer
 *  - E-postadresser
 * 
 * Licens: MIT
 * Författare: @jop-io, http://jop.io
 */
;(function (window, undefined) {
    "use strict";
    
    var Formator = {
        
        /**
         * Kontrollerar om ett svenskt mobiltelefonnummer är giltigt i enlighet 
         * med Post- & Telestyrelsens nummerplan för mobiltelefonitjänster.
         *
         * För att retunera mobiltelefonnumret i ett visst format, kan en andra
         * valfri parameter anges. De format som stöds är:
         *
         *     1. DEFAULT    = Numeriskt format (standard), NNNNNNNNNN
         *     2. INT_FORMAT = Internationellt format E.164, +46NNNNNNNNN
         *     3. NAT_FORMAT = Nationellt format, NNN-NNN NN NN
         *
         * @param {String} number Mobiltelefonnummer
         * @param {String} format Önskat format (1-3)
         * @returns {String|Boolean} Mobiltelefonnummer eller "false"
         */
        cellphone : function(number, format) {
            if (typeof number !== 'string') {
                return false;
            }
            var n = number.replace(/\D/g, ''), prefix = [70, 72, 73, 76, 79];
            for (var p in prefix) {
                if (n.indexOf(prefix[p]) > -1 && n.substring(n.indexOf(prefix[p]), n.length).length === 9) {
                    if (format && format === 'NAT_FORMAT') {
                        var fn = '0', pdx = n.indexOf(prefix[p]);
                        for (var i = pdx; i <= pdx + 8; i++) {
                            fn += (i === pdx + 2 ? '-' : (i === pdx + 5 || i === pdx + 7 ? ' ' : '')) + n.substr(i, 1);
                        }
                        return fn;
                    }
                    return (format && format === 'INT_FORMAT' ? '+46' : '0') + n.substring(n.indexOf(prefix[p]), n.length);
                }
            }
            return false;
        },
        
        /**
         * Kontrollerar om ett svenskt postnummer är giltigt i enlighet med 
         * Svenska Postnummersystemet och SS 613401:2011.
         * 
         * För att retunera postnumret i ett visst format, kan en andra valfri 
         * parameter anges. De format som stöds är:
         * 
         *     1. DEFAULT    = Numeriskt format (standard), NNNNN
         *     2. NAT_FORMAT = Nationellt format, NNN NN
         *     3. INT_FORMAT = Internationellt format, SE-NNN NN
         * 
         * Observera att funktionen endast kontrollerar om angivet postnummer 
         * ligger inom ett giltigt spann, och _inte_ om postnumret de facto är 
         * tilldelat ett geografiskt område. Funktionen särskiljer heller inte 
         * postnummer allokerade specifikt för postboxar.
         * 
         * @param {String} number Postnummer
         * @param {String} format Önskat format (1-3)
         * @returns {String|Boolean} Postnumret eller "false"
         */
        postalcode : function (number, format) {
            if (typeof number !== 'string') {
                return false;
            }
            var n = number.replace(/\D/g, ""), pfx = ["32", "48", "49", "99"], pn = parseInt(n, 10);
            if (n.length !== 5 || pn < 10000 || pn > 99000 || pfx.indexOf(n.substr(0, 2)) > -1) {
                return false;
            }
            return format === 'NAT_FORMAT' ? n.substr(0, 3) + " " + n.substr(-2) : format === 'INT_FORMAT' ? "SE-" + n.substr(0, 3) + " " + n.substr(-2) : n;
        },
        
        /**
         * Kontrollerar om en e-postadress är giltig enligt mönstret *@*.*. 
         * Maximal tillåten längd på en e-postadress är 254 tecken, i enlighet 
         * med RFC 3696.
         * 
         * För att retunera e-postadressen i ett visst format, kan en andra 
         * valfri parameter anges. De format som stöds är:
         * 
         *     1. DEFAULT   = Oförändrad, som inmatad e-postadress (standard)
         *     2. UPPERCASE = VERSAL E-POSTADRESS
         *     3. LOWERCASE = gemen e-postadress
         * 
         * @param {String} email E-postadress
         * @param {String} format Önskat format (1-3)
         * @returns {String|Boolean} E-postadress eller "false"
         */
        email : function (email, format) {
            var e = !!(/\S+@\S+\.\S+/.test(email) && email.indexOf("@") === email.lastIndexOf("@") && email.length < 255);
            email = (format === 'UPPERCASE' ? email.toUpperCase() : (format === 'LOWERCASE' ? email.toLowerCase() : email)).replace(/^\s+|\s+$/gm,'');
            return (e ? email : false);
        },
        
        /**
         * Kontrollerar om ett bankkortsnummer är giltigt i enlighet med ISO/IEC
         * 7812-1:2015.
         *
         * För att retunera bankkortsnumret i ett visst format, kan en andra 
         * valfri parameter anges. De format som stöds är:
         *
         *     1. DEFAULT = Utan skiljetecken (standard), NNNNNNNNNNNNNNNN
         *     2. SPACE   = Mellanslag (' ') som skiljetecken, NNNN NNNN NNNN NNNN
         *     3. DASH    = Bindestreck ('-') som skiljetecken, NNNN-NNNN-NNNN-NNNN
         *
         * @param {String} number Bankkortsnummer
         * @param {String} format Önskat format (1-3)
         * @returns {String|Boolean} Bankkortsnumret eller "false"
         */        
        bankcard : function(number, format) {
            if (typeof number !== 'string') {
                return false;
            }
            var n = number.replace(/\D/g, "");
            if (n.length < 11 || n.length > 21 || !this.luhn(n)) {
                return false;
            }
            if (['SPACE', 'DASH'].indexOf(format) > -1) {
                var num = '', sep = format === 'DASH' ? '-' : ' ';
                while (n.length > 0) {
                    num += n.substr(0, 4) + sep;
                    n = n.substr(4);
                }
                return num.substring(0, num.length-1);
            }
            return n;
        },
        
        /**
         * Kontrollerar om ett svenskt personnummer är giltigt i enlighet med 
         * Folkbokföringslagen 1991:481 (18§) och SKV 704.
         * 
         * För att retunera personnumret i ett visst format, kan en andra valfri 
         * parameter anges. De format som stöds är:
         * 
         *     1. DEFAULT = 12 siffror (standard), ÅÅÅÅMMDDNNNN
         *     2. SHORT   = 10 siffror med skiljetecken, ÅÅMMDD-NNNN
         * 
         * @param {String} number Person- eller samordningnummer
         * @param {String} format Önskat format (1-2)
         * @returns {String|Boolean} Personnummer eller "false"
         */
        personalid : function(number, format) {
            if (typeof number !== 'string') {
                return false;
            }
            var n = number.replace(/\D/g, "");
            if (!(n.length === 12 || n.length === 10) || this.luhn(n.substr(n.length-10,10)) === false) {
                return false;
            }
            var months = {1:31,2:29,3:31,4:30,5:31,6:30,7:31,8:31,9:30,10:31,11:30,12:31},
                month  = parseInt(n.substr(n.length-8,2), 10),
                day    = parseInt(n.substr(n.length-6,2), 10);
            if ((month < 1 || month > 12) || (day < 1 || day > months[month])) {
                return false;
            }
            var now = new Date(), 
                y   = now.getFullYear(),
                sep = number.substr(-5,1) === '+' ? '+' : '-';
            if (n.length === 10) {
                var input_year = parseInt(n.substr(0,2), 10),
                    century    = parseInt(y.toString().substr(0,2), 10),
                    year_2di   = parseInt(y.toString().substr(2,2), 10);
                century -= input_year > year_2di ? 1 : 0;
                century -= sep === '+' ? 1 : 0;
                n = century.toString().concat(n);                
            }
            return format === 'SHORT' ? n.substr(2,6)+sep+n.substr(-4,4) : n;
        },
        
        /**
         * Kontrollerar om ett svenskt organisationsnummer är giltigt i enlighet 
         * med Lagen om identitetsbeteckning för juridiska personer m.fl. 
         * (SFS 1974:174) och SKV 709.
         * 
         * För att retunera organisationsnumret i ett visst format, kan en andra 
         * valfri parameter anges. De format som stöds är:
         * 
         *     1. DEFAULT = 10 siffror med skiljetecken (standard), NNNNNN-NNNN
         *     2. FULL    = 12 siffror utan skiljetecken, NNNNNNNNNNNN
         *  
         *  Observera att svenska personnummer är giltiga organisationsnummer 
         *  för bolagsformen enskild firma.
         * 
         * @param {String} number Organisationsnummer
         * @param {String} format Önskat format (1-2)
         * @returns {String|Boolean} Organisationsnummer eller "false"
         */
        organizationid : function(number, format) {
            if (typeof number !== 'string') {
                return false;
            }
            var n = number.replace(/\D/g, "");
            if (!(n.length === 12 || n.length === 10) || this.luhn(n.substr(n.length-10,10)) === false) {
                return false;
            }
            n = parseInt(n.substr(-8,1), 10) < 2 ? this.personalid(number) : '16' + n.substr(-10,10);
            return !n ? false : format === 'FULL' ? n : n.substr(2,6)+'-'+n.substr(-4,4);
        },
        
        /**
         * Kontrollerar om ett svenskt momsregistreringsnummer är giltigt i 
         * enlighet skatteverkets riktlinjer för internationella 
         * momsregistreringsnummer.
         * 
         * Giltiga momsregistreringsnummer returneras _alltid_ i det 
         * internationella formatet 'SE NNNNNNNNNNNN'.
         * 
         * @param {String} number Momsregistreringsnummer
         * @returns {String|Boolean} Momsregistreringsnummer eller "false"
         */
        vatid : function(number) {
            if (typeof number !== 'string') {
                return false;
            }
            var n = this.organizationid(number, 'FULL');
            if (!n) {
                return false;
            }
            return 'SE ' + n.substr(-10,10) + '01';
        },
        
        /**
         * Hjälpfunktion för att kontrollera att en sifferserie valideras 
         * korrekt med Luhn-algoritmen.
         * 
         * @param {String} number Sifferserie som ska kontrolleras
         * @returns {Boolean} "true" eller "false"
         */
        luhn : function (number) {
            var len = number.length, bit = 1, sum = 0, val, arr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
            while (len) {
                val = parseInt(number.charAt(--len), 10);
                sum += (bit ^= 1) ? arr[val] : val;
            }
            return sum && sum % 10 === 0;
        }
    };
    
    window.formator = Formator;
}(window));
