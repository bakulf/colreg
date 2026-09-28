/**
 * Cloud photographs, from Wikimedia Commons, under free licences. Each is
 * cropped to 4:3 and resized to 800 × 600; the adapted files in
 * public/clouds/ are shared under the same licence as the original.
 *
 * The file title is kept for the record but never shown in a question, since
 * it names the cloud.
 */

export interface Photo {
  file: string;
  title: string;
  artist: string;
  licence: string;
  licenceUrl: string;
  source: string;
}

export const CLOUD_PHOTOS = {
  cirrus: [
    {
      file: 'clouds/cirrus-1.jpg',
      title: '20141118 abies.jpg',
      artist: 'Fontema',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      source: 'https://commons.wikimedia.org/wiki/File:20141118_abies.jpg',
    },
    {
      file: 'clouds/cirrus-2.jpg',
      title: 'Shoreham-by-Sea houseboat \'Die Fische\' M1096, Riverside Moorings, West Sussex 01.jpg',
      artist: 'Acabashi',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      source: 'https://commons.wikimedia.org/wiki/File:Shoreham-by-Sea_houseboat_%27Die_Fische%27_M1096,_Riverside_Moorings,_West_Sussex_01.jpg',
    },
  ],
  cirrocumulus: [
    {
      file: 'clouds/cirrocumulus-1.jpg',
      title: '2021-11-27 15 52 16 Cirrocumulus "Mackeral sky" above the Franklin Farm section of Oak Hill, Fairfax County, Virginia.jpg',
      artist: 'Famartin',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      source: 'https://commons.wikimedia.org/wiki/File:2021-11-27_15_52_16_Cirrocumulus_%22Mackeral_sky%22_above_the_Franklin_Farm_section_of_Oak_Hill,_Fairfax_County,_Virginia.jpg',
    },
    {
      file: 'clouds/cirrocumulus-2.jpg',
      title: '2021-11-27 15 54 11 Cirrocumulus "Mackeral sky" above the Franklin Farm section of Oak Hill, Fairfax County, Virginia.jpg',
      artist: 'Famartin',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      source: 'https://commons.wikimedia.org/wiki/File:2021-11-27_15_54_11_Cirrocumulus_%22Mackeral_sky%22_above_the_Franklin_Farm_section_of_Oak_Hill,_Fairfax_County,_Virginia.jpg',
    },
  ],
  cirrostratus: [
    {
      file: 'clouds/cirrostratus-1.jpg',
      title: '22°-Ring in Cirrostratus, Weitwinkelaufnahme.jpg',
      artist: 'GerritR',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      source: 'https://commons.wikimedia.org/wiki/File:22%C2%B0-Ring_in_Cirrostratus,_Weitwinkelaufnahme.jpg',
    },
    {
      file: 'clouds/cirrostratus-2.jpg',
      title: 'Cirrostratus fibratus mit 22°-Ring.jpg',
      artist: 'GerritR',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      source: 'https://commons.wikimedia.org/wiki/File:Cirrostratus_fibratus_mit_22%C2%B0-Ring.jpg',
    },
  ],
  altocumulus: [
    {
      file: 'clouds/altocumulus-1.jpg',
      title: 'Clouds over Nuthurst, West Sussex, England.jpg',
      artist: 'Acabashi',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      source: 'https://commons.wikimedia.org/wiki/File:Clouds_over_Nuthurst,_West_Sussex,_England.jpg',
    },
    {
      file: 'clouds/altocumulus-2.jpg',
      title: '201912 Sunset over Jinhua Mountains.jpg',
      artist: 'MNXANL',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      source: 'https://commons.wikimedia.org/wiki/File:201912_Sunset_over_Jinhua_Mountains.jpg',
    },
  ],
  altostratus: [
    {
      file: 'clouds/altostratus-1.jpg',
      title: '2017-06-22 16 57 51 Sun shining dimly through an altostratus cloud layer over Ladybank Lane in the Chantilly Highlands section of Oak Hill, Fairfax County, Virginia.jpg',
      artist: 'Famartin',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      source: 'https://commons.wikimedia.org/wiki/File:2017-06-22_16_57_51_Sun_shining_dimly_through_an_altostratus_cloud_layer_over_Ladybank_Lane_in_the_Chantilly_Highlands_section_of_Oak_Hill,_Fairfax_County,_Virginia.jpg',
    },
    {
      file: 'clouds/altostratus-2.jpg',
      title: '2019-02-10 15 20 16 The sun fading behind altostratus along Centreville Road (Virginia State Route 657) in Chantilly, Fairfax County, Virginia.jpg',
      artist: 'Famartin',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      source: 'https://commons.wikimedia.org/wiki/File:2019-02-10_15_20_16_The_sun_fading_behind_altostratus_along_Centreville_Road_(Virginia_State_Route_657)_in_Chantilly,_Fairfax_County,_Virginia.jpg',
    },
  ],
  nimbostratus: [
    {
      file: 'clouds/nimbostratus-1.jpg',
      title: '2023-10-29 12 25 36 View towards dark clouds from Burlington County Route 630 (Woodlane Road) in Westampton Township, Burlington County, New Jersey.jpg',
      artist: 'Famartin',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      source: 'https://commons.wikimedia.org/wiki/File:2023-10-29_12_25_36_View_towards_dark_clouds_from_Burlington_County_Route_630_(Woodlane_Road)_in_Westampton_Township,_Burlington_County,_New_Jersey.jpg',
    },
    {
      file: 'clouds/nimbostratus-2.jpg',
      title: '2023-10-29 12 25 31 View towards dark clouds from Burlington County Route 630 (Woodlane Road) in Westampton Township, Burlington County, New Jersey.jpg',
      artist: 'Famartin',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      source: 'https://commons.wikimedia.org/wiki/File:2023-10-29_12_25_31_View_towards_dark_clouds_from_Burlington_County_Route_630_(Woodlane_Road)_in_Westampton_Township,_Burlington_County,_New_Jersey.jpg',
    },
  ],
  stratocumulus: [
    {
      file: 'clouds/stratocumulus-1.jpg',
      title: '104 Cel amenaçador.jpg',
      artist: 'Enric',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      source: 'https://commons.wikimedia.org/wiki/File:104_Cel_amena%C3%A7ador.jpg',
    },
    {
      file: 'clouds/stratocumulus-2.jpg',
      title: '2018 Central Chernozem Zapovednik 11 34 26 010000.jpeg',
      artist: 'Ivtorov',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      source: 'https://commons.wikimedia.org/wiki/File:2018_Central_Chernozem_Zapovednik_11_34_26_010000.jpeg',
    },
  ],
  stratus: [
    {
      file: 'clouds/stratus-1.jpg',
      title: '"Whispers of the Clouds, A Symphony in the Silent Mountains" 🌫️🌲⛰️.jpg',
      artist: 'Vasupanwar',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      source: 'https://commons.wikimedia.org/wiki/File:%22Whispers_of_the_Clouds,_A_Symphony_in_the_Silent_Mountains%22_%F0%9F%8C%AB%EF%B8%8F%F0%9F%8C%B2%E2%9B%B0%EF%B8%8F.jpg',
    },
    {
      file: 'clouds/stratus-2.jpg',
      title: '2015-01-14 11 43 55 View north under some low clouds along Nevada State Route 487 (Baker Road) north of Baker, Nevada.JPG',
      artist: 'Famartin',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      source: 'https://commons.wikimedia.org/wiki/File:2015-01-14_11_43_55_View_north_under_some_low_clouds_along_Nevada_State_Route_487_(Baker_Road)_north_of_Baker,_Nevada.JPG',
    },
  ],
  cumulus: [
    {
      file: 'clouds/cumulus-1.jpg',
      title: '. - panoramio (337).jpg',
      artist: 'AmanovDmitry',
      licence: 'CC BY 3.0',
      licenceUrl: 'https://creativecommons.org/licenses/by/3.0',
      source: 'https://commons.wikimedia.org/wiki/File:._-_panoramio_(337).jpg',
    },
    {
      file: 'clouds/cumulus-2.jpg',
      title: '. - panoramio (229).jpg',
      artist: 'AmanovDmitry',
      licence: 'CC BY 3.0',
      licenceUrl: 'https://creativecommons.org/licenses/by/3.0',
      source: 'https://commons.wikimedia.org/wiki/File:._-_panoramio_(229).jpg',
    },
  ],
  cumulonimbus: [
    {
      file: 'clouds/cumulonimbus-1.jpg',
      title: '20200607 Chmura cumulonimbus incus nad Krakowem 1407 0252.jpg',
      artist: 'Jakub Hałun',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      source: 'https://commons.wikimedia.org/wiki/File:20200607_Chmura_cumulonimbus_incus_nad_Krakowem_1407_0252.jpg',
    },
    {
      file: 'clouds/cumulonimbus-2.jpg',
      title: '08-30-2020 Cumululonimbus cloud.jpg',
      artist: 'Shellparakeet',
      licence: 'CC0',
      licenceUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
      source: 'https://commons.wikimedia.org/wiki/File:08-30-2020_Cumululonimbus_cloud.jpg',
    },
  ],
} as const satisfies Record<string, readonly Photo[]>;
