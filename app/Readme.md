# Programrendszerek fejlesztése beadandó
## Fake-Neptun - Varga Dominik (GZN1EV)

### Feladatkiírás

Szerepkörök: admin, tanár és diák.

Az admin létrehozhat és megoszthat kurzusokat a diákokkal. A tanárok csak azokat a kurzusokat hozhatják létre vagy módosíthatják, ahol ők az adott tanárok, de nem oszthatják meg azokat a diákokkal. A tanárok által létrehozott kurzusok tervezet státuszban vannak, csak akkor nyílnak meg, ha az admin ezt jóváhagyja. A kurzusinformációknak tartalmazniuk kell a nevet, leírást, ütemtervet, diákok limitjét, tanár nevét. A diákok csak akkor jelentkezhetnek az elérhető kurzusokra, ha a diákok számának limitje még nem ért el. Listázhatják az elérhető és a már felvett kurzusokat is. A regisztráció csak a diákok számára nyitott, a tanárok és az adminok előre regisztrálva vannak.

### Beüzemelés

#### Adatbázis

A repo-ban található egy database mappa, amiben elhelyeztem az adatbázis futtatására használható `docker-compose.yml` fájlt. Emellett van még egy `mongo-dump` mappa is ami volume-ként hozzá van adva a mongodb-t futtató container-hez a /dump útvonalon. Ebben találhatók az exportált demo adatok.

1. Indítsunk terminált és navigáljunk a `database` mappába
2. Használjuk a `docker compose up -d` parancsot a mongodb és mongo-express container-ek elindításához.
3. Futtassuk a következő parancsot a demó adatok adatbázisba töltéséhez:
```
docker exec mongodb mongorestore --username root --password password --authenticationDatabase admin --dir /dump
```

#### Backend

A REST API-t biztosító szervert a server mappában helyeztem el.

1. Indítsunk terminált és navigáljunk a repo `server` mappájába
2. Futtassuk az `npm install` parancsot a függőségek telepítéséhez
3. Futtassuk az `npm run build` parancsot 
4. A backend elindításához használjuk az `npm run backend` parancsot

#### Frontend

A web-alkalmazás a client mappában kapott helyet.

1. Indítsunk terminált és navigáljunk a repo `client` mappájába
2. Futtassuk az `npm install` parancsot a függőségek telepítéséhez
3. Futtassuk az `npm run start` parancsot a web-alkalmazás elindításához.

### Használat

A web-alkalmazás funkciói csak bejelentkezés után érhetők el (kivéve a regisztráció), ehhez a feladatkiírásnak megfelelően létre lett hozva 1 admin fiók és 3 tanár fiók, a tanuló jogosultságért pedig szabadon lehet regisztrálni.

#### Előre létrehozott fiókok bejelentkezési adatai

|Felhasználónév         |Jelszó    | Jogosultság |
|-----------------------|----------|-------------|
|admin@fakeneptun.com   | admin    | Admin       |
|teacher1@fakeneptun.com| teacher1 | Tanár       |
|teacher2@fakeneptun.com| teacher2 | Tanár       |
|teacher3@fakeneptun.com| teacher3 | Tanár       |