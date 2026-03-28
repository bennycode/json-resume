export interface ResumeProfile {
  network: string;
  username: string;
  url: string;
}

export interface ResumeLocation {
  address: string;
  postalCode: string;
  city: string;
  countryCode: string;
  region: string;
}

export interface ResumeBasics {
  name: string;
  label: string;
  image: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: ResumeLocation;
  profiles: ResumeProfile[];
}

export interface Resume {
  basics: ResumeBasics;
}

export function createEmptyBasics(): ResumeBasics {
  return {
    name: "",
    label: "",
    image: "",
    email: "",
    phone: "",
    url: "",
    summary: "",
    location: {
      address: "",
      postalCode: "",
      city: "",
      countryCode: "",
      region: "",
    },
    profiles: [],
  };
}

export function createEmptyProfile(): ResumeProfile {
  return {
    network: "",
    username: "",
    url: "",
  };
}
