# Mobilitätskonto
**Semesterprojekt: An Upgrade for Financial Services**


### Installation

#### 1. Backend bzw. HANA DB einrichten

Alle benötigten Daten für das Backend können in diesem [Git Repository](https://gitlab.informatik.hu-berlin.de/sp_fs_2019_mob/mobilitaetskonto-db) gefunden werden.

#### 2. Projekt in SAP WebIDE importieren

`File` > `Git` > `Clone Repository` auswählen und bei der URL dieses Projekt einfügen: [Clone URL](https://gitlab.informatik.hu-berlin.de/sp_fs_2019_mob/mobilitaetskonto.git). 

Dann mit `Clone` importieren.

#### 3. App öffnen und dann ersten Nutzer manuell in HANA Catalog freischalten und als Verwalter setzen:

In HANA Catalog Toolbar `Open SQL Console` auswählen, nutzen Sie bitte den folgenden SQL Befehl und setzen Ihre MID in Zeile 2 und 3 ein. Diese MID können Sie in der Content Ansicht der Mitarbeitertabelle sehen.

``` SQL
UPDATE "MOBILITAETSKONTO"."MITARBEITER"
SET FREIGABEWERT = 1000, AKTIV = true, FREIGEBER = 'IHRE-MID'
WHERE MID = 'IHRE-MID';
```

### Weitere Ressourcen

#### Script zum automatischen Starten der HANA DB
[Autostart HANA](https://gitlab.informatik.hu-berlin.de/sp_fs_2019_mob/autostart-hana)

#### Dokumentation
[JS Doc](https://gitlab.informatik.hu-berlin.de/sp_fs_2019_mob/mobilitaetskonto/-/wikis/home)

#### Aktueller Release aus master Branch
[Mobilitätskonto](https://mobilitaetskonto-p2001828414trial.dispatcher.hanatrial.ondemand.com/index.html)

#### Gruppenmitglieder
[Übersicht](https://gitlab.informatik.hu-berlin.de/sp_fs_2019_mob/mobilitaetskonto/-/wikis/Contacts)
