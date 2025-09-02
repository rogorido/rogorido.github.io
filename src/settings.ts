export const profile = {
  fullName: "Igor Sosa Mayor",
  title: "Dr. Dr.",
  institute: "",
  author_name: "Igor Sosa Mayor", // Author name to be highlighted in the papers section
  research_areas: [
    {
      title: "Early Modern History",
      description:
        "My main period of research is the early modern history, specially religious changes and their relationships with social and geopolitical changes.",
      field: "history",
    },
    {
      title: "Global History",
      description:
        "I'm interested in global phenonoma related to religious developments in the early modern period. Above all the relationships between religion, geopolitics and culture in Eurasia.",
      field: "history",
    },
    {
      title: "Digital Humanities",
      description:
        "I'm interested in Geographical Information Systems, Large Language Models, topic modelling, and other topics in the field.",
      field: "history",
    },
  ],
};

// Set equal to an empty string to hide the icon that you don't want to display
export const social = {
  email: "igor.sosa@eui.europeo",
  linkedin: "",
  x: "",
  github: "https://github.com/rogorido",
  gitlab: "",
  scholar: "",
  inspire: "",
  arxiv: "",
  orcid: "https://orcid.org/0000-0003-3645-8454",
};

export const template = {
  website_url: "https://rogorido.github.io", // Astro needs to know your site’s deployed URL to generate a sitemap. It must start with http:// or https://
  menu_left: false,
  transitions: true,
  // lightTheme: "light", // Select one of the Daisy UI Themes or create your own
  lightTheme: "lemonade", // Select one of the Daisy UI Themes or create your own
  darkTheme: "dark", // Select one of the Daisy UI Themes or create your own
  excerptLength: 200,
  postPerPage: 5,
  base: "", // Repository name starting with /
};

export const seo = {
  default_title: "Portfolio | Igor Sosa Mayor",
  default_description: "Academic Portfolio of Igor Sosa Mayor.",
  default_image: "/images/fotoigorsosa.png",
};
