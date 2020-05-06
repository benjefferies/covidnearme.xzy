# covidnearme.xzy

Source for https://covidnearme.xzy. An app to show the trends of covid-19 in the England by district.


## Data
* https://coronavirus.data.gov.uk/archive
* https://www.england.nhs.uk/statistics/statistical-work-areas/covid-19-daily-deaths/

The death data does not contain district information. It's therefore enriched with Google Places API data. Note there could be some inconsistencies in this enrichment given we're searching for the place with just the hospital name.
