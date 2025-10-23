# Devops gyakorlat beadandó

Ez a projekt a Programrendszerek fejlesztése gyakorlatra készült projektem továbbfejlesztése devops eszközök használatával.

## Előkövetelmények
Ezeknek kell teljesülnie, ahhoz hogy futtatható legyen a folyamat

- Windows op. rendszer
- docker telepítés
- minikube telepítés
- terraform telepítés

## Futtatás

1. Jenkins indítása (docker compose up -d)
2. setup.ps1 szkript futtatása rendszergazdaként (vagy rendszergazda jogosultság megadása, amikor kéri)
3. Jenkins felületre bejelentkezés (http://localhost:8080, admin-admin)
4. prf-project pipeline konfigurálás -> `\<FILL-IN\>` placeholder lecserélése a prf-beadando/app/infra mappa teljes host elérési útvonalával (pl.: "C:\\Repos\\prf-beadando\\app\\infra)
5. Pipeline mentés
6. Build now 
7. A hosts fájlhoz adjuk hozzá a pipeline által javasolt bejegyzéseket
8. Az alkalmazás elérhető a `http://fakeneptun.com/` címen, a Prometheus pedig a `http://prometheus.fakeneptun.com` címen