import { cars } from './cars';

export interface AssetCredit { author: string; source: string; license: string; licenseUrl: string; }
export interface GarageAsset { model: string; photo: string; yaw: number; paintMaterial: string; modelCredit: AssetCredit; photoCredit: AssetCredit; }
const assets: Record<string, GarageAsset> = {
  "rx7": {
    "model": "models/garage/mazda-rx-7-fd.glb",
    "photo": "images/garage/mazda-rx-7-fd.jpg",
    "yaw": 0,
    "paintMaterial": "Material.007",
    "modelCredit": {
      "author": "Lexyc16",
      "source": "https://sketchfab.com/3d-models/mazda-rx-7-fd-d35ff630df614771b82e7b2f59035b1e",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
    },
    "photoCredit": {
      "author": "Mr.choppers",
      "source": "https://commons.wikimedia.org/wiki/File:1994_Mazda_RX-7_R2_in_Vintage_Red,_front_left_(Lime_Rock).jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "supra": {
    "model": "models/garage/toyota-supra-mk.glb",
    "photo": "images/garage/toyota-supra-a80.jpg",
    "yaw": 0,
    "paintMaterial": "TOYOTA_SUPRA_CAR_PAINT",
    "modelCredit": {
      "author": "Martin Trafas",
      "source": "https://sketchfab.com/3d-models/toyota-supra-mk-iv-1994-eb9bb1eb41db431cb078088ae1ce45f8",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
    },
    "photoCredit": {
      "author": "Dinkun Chen",
      "source": "https://commons.wikimedia.org/wiki/File:TOYOTA_SUPRA_(A80)_HONG_KONG.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "skyline": {
    "model": "models/garage/nissan-skyline-r34.glb",
    "photo": "images/garage/nissan-skyline-r34.jpg",
    "yaw": 0,
    "paintMaterial": "Material.001",
    "modelCredit": {
      "author": "Lexyc16",
      "source": "https://sketchfab.com/3d-models/nissan-skyline-r34-gt-r-ff8fb2251dfa4bb9979e7022c5a6666c",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
    },
    "photoCredit": {
      "author": "Tennen-Gas",
      "source": "https://commons.wikimedia.org/wiki/File:Nissan_Skyline_R34_GT-R_N%C3%BCr_001.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  }
};
const root = import.meta.env.BASE_URL;
export const garageAssets: Record<string, GarageAsset> = Object.fromEntries(Object.entries(assets).map(([id, asset]) => [id, { ...asset, model: root + asset.model, photo: root + asset.photo }]));
export const garageCars = cars.filter((car) => garageAssets[car.id]);
