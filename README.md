# formator.js
Formator.js är ett lättviktigt bibliotek (mindre än 1 kilobyte) för att validera och formatera olika typer av formulärsdata. Biblioteket är särskilt användbart där kunder anger data i en köpprocess, tex. vid registrering av kundkonton eller utcheckning i kassor på e-handelssidor.

## Användningsområden
Formator.js kan användas i två syften; dels för att validera att forumlärsdata är giltig (korrekt inmatad) samt för att formatera datan i ett standardenligt format. Biblioteket har stöd för att validera och formatera följande typer av inmatad data:

* Svenska [mobiltelefonnummer](https://github.com/jop-io/formator.js/blob/master/README.md#mobiltelefonnummer)
* Svenska [postnummer](https://github.com/jop-io/formator.js/blob/master/README.md#postnummer)
* Svenska [personnummer](https://github.com/jop-io/formator.js/blob/master/README.md#personnummer)
* Svenska [organisationsnummer](https://github.com/jop-io/formator.js/blob/master/README.md#organisationsnummer)
* Svenska [momsregistreringsnummer](https://github.com/jop-io/formator.js/blob/master/README.md#momsregistreringsnummer)
* [Bankkortsnummer](https://github.com/jop-io/formator.js/blob/master/README.md#bankkortsnummer)
* [E-postadresser](https://github.com/jop-io/formator.js/blob/master/README.md#e-postadresser)

# Demo
[http://jop.io/projects/formator-js](http://jop.io/projects/formator-js)

# Installation
```javascript
<script src="formator.min.js"></script>
```

# Exempel på använding
Samtliga valideringsfunktioner returnerar inmatad data (med formatering) om datan valideras som giltig. I fall datan valideras som ogiltig returneras *`false`*.

### Mobiltelefonnummer
Mobiltelefonnummer valideras enligt [Post- & Telestyrelsens nummerplan](https://www.pts.se/sv/Bransch/Telefoni/Nummerfragor/Telefoninummerplanen/Telefoninummerplanens-disposition/) för mobiltelefonitjänster. De svenska mobiltelefonitjänsterna inleds med prefixen *70*, *72*, *73*, *76* och *79*.

Mobiltelefonnummer vilka valideras som giltiga returneras formaterade. För att välja format på datan som returneras anges en sekundär parameter med ett av följande värden:

1. `DEFAULT`    = Numeriskt format (standard), NNNNNNNNNN
2. `INT_FORMAT` = Internationellt format E.164, +46NNNNNNNNN
3. `NAT_FORMAT` = Nationellt format, NNN-NNN NN NN

**Numerisk formatering**
```javascript
formator.cellphone("0702112233"); // returnerar 0702112233
formator.cellphone("+460702112233"); // returnerar 0702112233
formator.cellphone("070-211 22 33"); // returnerar 0702112233
```
**Internationell formatering**
```javascript
formator.cellphone("0702112233", "INT_FORMAT"); // returnerar +46702112233
formator.cellphone("+460702112233", "INT_FORMAT"); // returnerar +46702112233
formator.cellphone("070-211 22 33", "INT_FORMAT"); // returnerar +46702112233
```
**Nationell formatering**
```javascript
formator.cellphone("0702112233", "NAT_FORMAT"); // returnerar 070-211 22 33
formator.cellphone("+460702112233", "NAT_FORMAT"); // returnerar 070-211 22 33
formator.cellphone("070-211 22 33", "NAT_FORMAT"); // returnerar 070-211 22 33
```
**Ej giltiga telefonnummer (returnerar false)**
```javascript
formator.cellphone("0710112233"); // returnerar false
formator.cellphone("07021122"); // returnerar false
formator.cellphone("0812345678"); // returnerar false
```

### Postnummer
Postnummer valideras i enlighet med [SS 613401:2011](http://www.sis.se/sociologi-service-f%C3%B6retagsorganisation-och-ledning-och-administration/postala-tj%C3%A4nster/ss-6134012011) och det [Svenska Postnummersystemet](http://www.postnummerservice.se/information/faq/adresser-och-postnummer/hur-aer-postnummer-uppbyggda-i-sverige).

Postnummer vilka valideras som giltiga returneras formaterade. För att välja format på datan som returneras anges en sekundär parameter med något av följande värden:

1. `DEFAULT`    = Numeriskt format (standard), NNNNN
2. `NAT_FORMAT` = Nationellt format, NNN NN
3. `INT_FORMAT` = Internationellt format, SE-NNN NN

**Formatering av postnummer vilka valideras som giltiga**
```javascript
formator.postalcode("54100"); // returnerar 54100
formator.postalcode("54100", "NAT_FORMAT"); // returnerar 541 00
formator.postalcode("54100", "INT_FORMAT"); // returnerar SE-541 00
```
**Ej giltiga postnummer (returnerar false)**
```javascript
formator.postalcode("00001"); // returnerar false (ogiltigt värde)
formator.postalcode("49152"); // returnerar false (ogiltig nummerserie)
formator.postalcode("123"); // returnerar false (ogiltigt längd)
```

### Personnummer
Personnummer valideras i enlighet med [Folkbokföringslagen 1991:481, § 18 ](https://www.riksdagen.se/sv/Dokument-Lagar/Lagar/Svenskforfattningssamling/sfs_sfs-1991-481/) och [SKV 704](http://www.skatteverket.se/privat/sjalvservice/blanketterbroschyrer/broschyrer/info/704.4.39f16f103821c58f680007993.html).

Personnummer vilka valideras som giltiga returneras formaterade. För att välja format på datan som returneras anges en sekundär parameter med något av följande värden:

1. `DEFAULT` = 12 siffror (standard), ÅÅÅÅMMDDNNNN
2. `SHORT`   = 10 siffror med skiljetecken, ÅÅMMDD-NNNN

&ast;*Skiljetecken är antingen "-" eller "+" beroende på om födelseåret inträffade för mer än 99 år sedan.*

**Formatering av personnummer vilka valideras som giltiga**
```javascript
formator.personalid("900101-5701"); // returnerar 199001015701
formator.personalid("900101-5701", "SHORT"); // returnerar 900101-5701
formator.personalid("191001011145", "SHORT"); // returnerar 100101+1145
```
**Ej giltiga personnummer (returnerar false)**
```javascript
formator.personalid("900101-5705"); // returnerar false (felaktig kontrollsiffra)
formator.personalid("901301-5701"); // returnerar false (ogiltigt födelsemånad)
formator.personalid("900132-5701"); // returnerar false (ogiltigt födelsedag)
```

### Organisationsnummer
Organisationsnummer valideras i enlighet med [Lagen om identitetsbeteckning för juridiska personer (1974:174)](https://www.riksdagen.se/sv/Dokument-Lagar/Lagar/Svenskforfattningssamling/sfs_sfs-1974-174/) och [SKV 709](https://www.skatteverket.se/foretagorganisationer/sjalvservice/blanketterbroschyrer/broschyrer/info/709.4.39f16f103821c58f680008001.html).

Organisationsnummer vilka valideras som giltiga returneras formaterade. För att välja format på datan som returneras anges en sekundär parameter med något av följande värden:

1. `DEFAULT` = 10 siffror med skiljetecken (standard), NNNNNN-NNNN
2. `FULL`    = 12 siffror utan skiljetecken, NNNNNNNNNNNN

```javascript
formator.organizationid("5562537513"); // returnerar 556253-7513
formator.organizationid("5562537513", "FULL"); // returnerar 165562537513
formator.organizationid("0812345678"); // returnerar false
```

### Momsregistreringsnummer
Momsregistreringsnummer valideras i enlighet [skatteverkets riktlinjer](http://www.skatteverket.se/foretagorganisationer/moms/momsvidhandelmedeulander/kontrollerakoparensmomsregisteringsnummer/momsregistreringsnummer.4.18e1b10334ebe8bc80002649.html) för internationella momsregistreringsnummer.

Giltiga momsregistreringsnummer returneras *alltid* i det internationella formatet `SE NNNNNNNNNNNN`.

```javascript
formator.vatid("5562537513"); // returnerar SE 556253751301
formator.vatid("0812345678"); // returnerar false
```

### Bankkortsnummer
Bankkortsnummer valideras som giltiga i enlighet med [ISO/IEC 7812-1:2015](http://www.iso.org/iso/catalogue_detail?csnumber=66011).

Bankkortsnummer vilka valideras som giltiga returneras formaterade. För att välja format på datan som returneras anges en sekundär parameter med något av följande värden:

1. `DEFAULT` = Utan skiljetecken (standard), NNNNNNNNNNNNNNNN
2. `SPACE`   = Mellanslag (' ') som skiljetecken, NNNN NNNN NNNN NNNN
3. `DASH`    = Bindestreck ('-') som skiljetecken, NNNN-NNNN-NNNN-NNNN

```javascript
formator.bankcard("6011643488816290"); // returnerar 6011643488816290
formator.bankcard("5498358809721384", "SPACE"); // returnerar 5498 3588 0972 1384
formator.bankcard("4916314047956685", "DASH"); // returnerar 4916-3140-4795-6685
formator.bankcard("5354007325776612"); // returnerar false (felaktig kontrollsiffra)
formator.bankcard("53540073257"); // returnerar false (felaktig längd)
```

### E-postadresser
E-postadresser valideras som giltiga enligt mönstret `*@*.*`.  Maximal tillåten längd på en e-postadress är 254 tecken, i enlighet med [RFC 3696](https://tools.ietf.org/html/rfc3696).

E-postadresse vilka valideras som giltiga returneras formaterade. För att välja format på datan som returneras anges en sekundär parameter med något av följande värden:

1. `DEFAULT`   = Oförändrad, som inmatad e-postadress (standard)
2. `UPPERCASE` = VERSAL E-POSTADRESS
3. `LOWERCASE` = gemen e-postadress

```javascript
formator.email("Bill.Gates@microsoft.com"); // returnerar Bill.Gates@microsoft.com
formator.email("bill.gates@microsoft.com", "UPPERCASE"); // returnerar BILL.GATES@MICROSOFT.COM
formator.email("bill.gates@microsoft.com", "LOWERCASE"); // returnerar bill.gates@microsoft.com
formator.email("bill@gates"); // returnerar false
formator.email("bill.g@tes@microsoft.com"); // returnerar false
formator.email("bill.gates@.com"); // returnerar false
formator.email("@microsoft.com"); // returnerar false
```

## Licens
Formator.js omfattas av licensformen [MIT](https://opensource.org/licenses/MIT "The MIT License"). Varsågod!
