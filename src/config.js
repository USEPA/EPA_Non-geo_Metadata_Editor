var noop = function() {};

var global_validators = {
  nonTrivialText: function(txt, options) {
    if (txt.trim().length === 0) return "Empty.";
    if (
      txt.split(" ").filter(function(n) {
        return n && n.length >= options.minCharsinWord;
      }).length >= options.minWords
    )
      return "";
    else return "You need to provide a non-trivial value.";
  },

  mustSelectAtLeastOneTag: function(selectedTags, options) {
    noop(options); // So that linter does not complain
    if (selectedTags.length >= 1) return "";
    else return "Must select at least one.";
  },

  validDate: function(txt, options) {
    noop(options); // So that linter does not complain
    txt = txt.trim();
    if (txt == "") return "Empty.";
    // Is it a valid date
    if (txt.match(/^\d\d\d\d-\d\d-\d\d$/) && Date.parse(txt)) return "";
    return "Invalid date.";
  },

  validRange: function(txt, options) {
    noop(options); // So that linter does not complain
    txt = txt.trim();
    if (txt == "" || txt == "/") return "Empty.";
    // Is it a valid date range
    var parts = txt.split("/");
    if (parts.length != 2) return "Invalid date range.";
    var dtStart = parts[0];
    var dtEnd = parts[1];
    if ((dtStart && !dtEnd) || (!dtStart && dtEnd))
      return "Incomplete date range.";
    if (
      dtStart.match(/^\d\d\d\d-\d\d-\d\d$/) &&
      dtEnd.match(/^\d\d\d\d-\d\d-\d\d$/)
    ) {
      dtStart = Date.parse(dtStart);
      dtEnd = Date.parse(dtEnd);
      if (!dtStart) return "Invalid start date.";
      if (!dtEnd) return "Invalid end date.";
      if (dtStart > dtEnd) return "Start date later than end date.";
      return "";
    }
    return "Invalid date range.";
  },

  validDateOrRepetition: function(txt, options) {
    noop(options); // So that linter does not complain
    // Is it a repetition
    if (txt.match(/^R\/PT?\d+[DHMWY]$/)) return "";
    // Is it a valid date
    if (txt.match(/^\d\d\d\d-\d\d-\d\d$/) && Date.parse(txt)) return "";
    return "Invalid value.";
  },

  validEmail: function(email, options) {
    noop(options); // So that linter does not complain
    if (email.trim() == "") return "Empty.";
    // Email validation is tricky business... and in the eye of the beprovider...
    var re = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
    if (re.test(String(email).toLowerCase())) return "";
    return "Invalid email address.";
  },

  validUrl: function(url, options) {
    noop(options); // So that linter does not complain
    if (url.trim() == "") return "Empty.";
    var urlRegexp = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;

    if (url.match(urlRegexp)) return "";
    return "Invalid URL.";
  },

  nonEmpty: function(txt, options) {
    noop(options); // So that linter does not complain
    if (txt.trim() > "") return "";
    return "Empty.";
  },

  crossValidateModifiedAndAccrualPeriodicity: function(txt, options) {
    noop(options); // So that linter does not complain
    if (options.doc.modified || options.doc.accrualPeriodicity) return "";
    if (!options.doc.modified || !options.doc.accrualPeriodicity)
      return "Empty.";
    return "You must populate update frequency element when you leave last update element empty.";
  },

  passThruValidation: function(obj, options) {
    noop(options); // So that linter does not complain
    var val;
    if (obj && Array.isArray(obj)) {
      val = obj.find(item => item.validations);
      if (val) val = val.validations;
    }
    return val ? val : "Empty.";
  }
};

var validationIsEmpty = function(validation) {
  return (
    validation.startsWith("Empty.") ||
    validation.startsWith("Must select at least one.") ||
    validation.startsWith("Must make a selection.")
  );
};

var validation_config = {
  empty: {
    mandatory: { icon: "fas fa-exclamation-triangle", color: "fdae61" },
    optional: { icon: "fas fa-question-circle", color: "9e9e9e91" }
  },
  nonempty: {
    valid: { icon: "fas fa-check-circle", color: "1a9641" },
    invalid: { icon: "fas fa-times-circle", color: "d7191c" }
  }
};

export default {
  global_validators: global_validators,
  validationIsEmpty: validationIsEmpty,
  validation_config: validation_config,

  getValiMandaVisualizer: function(validations, mandatory, forIcon = true) {
    var vals = validations.replace(/^\s+|\s+$/g, "");
    var isEmpty = validationIsEmpty(vals);
    var isValid = vals == "";
    var icon = "fas fa-meh-rolling-eyes";
    var color = "000000";
    if (mandatory && isEmpty) {
      icon = validation_config.empty.mandatory.icon;
      color = validation_config.empty.mandatory.color;
    } else if (!mandatory && isEmpty) {
      icon = validation_config.empty.optional.icon;
      color = validation_config.empty.optional.color;
    } else if (isValid) {
      icon = validation_config.nonempty.valid.icon;
      color = validation_config.nonempty.valid.color;
    } else if (!isValid) {
      icon = validation_config.nonempty.invalid.icon;
      color = validation_config.nonempty.invalid.color;
    }
    var style = "color:#" + color;
    if (forIcon) style += ";font-size:2em;width:2em;";
    //;text-shadow: 3px 3px 16px #666666
    return { icon: icon, style: style };
  },

  title: {
    mandatory: true,
    validators: [
      {
        fn: global_validators.nonTrivialText,
        args: { minWords: 2, minCharsinWord: 3 }
      }
    ]
  },
  description: {
    mandatory: true,
    validators: [
      {
        fn: global_validators.nonTrivialText,
        args: { minWords: 5, minCharsinWord: 3 }
      }
    ]
  },
  tags_iso: {
    mandatory: true,
    validators: [{ fn: global_validators.mustSelectAtLeastOneTag, args: {} }],
    availableTags: [
      {
        value: "farming",
        label: "farming",
        info:
          "Rearing of animals and/or cultivation of plants <br/>Examples: agriculture, irrigation, aquaculture, plantations, herding, pests and diseases affecting crops and livestock"
      },
      {
        value: "biota",
        label: "biota",
        info:
          "Flora and/or fauna in natural environment <br/>Examples: wildlife, vegetation, biological sciences, ecology, wilderness, sealife, wetlands, habitat"
      },
      {
        value: "boundaries",
        label: "boundaries",
        info:
          "Legal land descriptions <br/>Examples: political and administrative boundaries"
      },
      {
        value: "climatologyMeteorologyAtmosphere",
        label: "climatology / meteorology / atmosphere",
        info:
          "Processes and phenomena of the atmosphere. <br/>Examples: cloud cover, weather, climate, atmospheric conditions, climate change, precipitation"
      },
      {
        value: "economy",
        label: "economy",
        info:
          "Economic activities, conditions and employment. <br/>Examples: production, labour, revenue, commerce, industry, tourism and ecotourism, forestry, fisheries, commercial or subsistence hunting, exploration and exploitation of resources such as minerals, oil and gas"
      },
      {
        value: "elevation",
        label: "elevation",
        info:
          "Height above or below sea level <br/>Examples: altitude, bathymetry, digital elevation models, slope, derived products"
      },
      {
        value: "environment",
        label: "environment",
        info:
          "Environmental resources, protection and conservation <br/>Examples: environmental pollution, waste storage and treatment, environmental impact assessment, monitoring environmental risk, nature reserves, landscape"
      },
      {
        value: "geoscientificInformation",
        label: "geoscientific information",
        info:
          "Information pertaining to earth sciences <br/>Examples: geophysical features and processes, geology, minerals, sciences dealing with the composition, structure and origin of the earth’s rocks, risks of earthquakes, volcanic activity, landslides, gravity information, soils, permafrost, hydrogeology, erosion"
      },
      {
        value: "health",
        label: "health",
        info:
          "Health, health services, human ecology, and safety Examples: disease and illness, factors affecting health, hygiene, substance abuse, mental and physical health, health services"
      },
      {
        value: "imageryBaseMapsEarthCover",
        label: "imagery / base maps / earth cover",
        info:
          "Base maps <br/>Examples: land cover, topographic maps, imagery, unclassified images, annotations"
      },
      {
        value: "intelligenceMilitary",
        label: "intelligence / military",
        info:
          "Military bases, structures, activities <br/>Examples: barracks, training grounds, military transportation, information collection"
      },
      {
        value: "inlandWaters",
        label: "inland waters",
        info:
          "Inland water features, drainage systems and their characteristics Examples: rivers and glaciers, salt lakes, water utilization plans, dams, currents, floods, water quality, hydrographic charts"
      },
      {
        value: "location",
        label: "location",
        info:
          "Positional information and services <br/>Examples: addresses, geodetic networks, control points, postal zones and services, place names"
      },
      {
        value: "oceans",
        label: "oceans",
        info:
          "Features and characteristics of salt water bodies (excluding inland waters) <br/>Examples: tides, tidal waves, coastal information, reefs"
      },
      {
        value: "planningCadastre",
        label: "planning / cadastre",
        info:
          "Information used for appropriate actions for future use of the land <br/>Examples: land use maps, zoning maps, cadastral surveys, land ownership"
      },
      {
        value: "society",
        label: "society",
        info:
          "Characteristics of society and cultures <br/>Examples: settlements, anthropology, archaeology, education, traditional beliefs, manners and customs, demographic data, recreational areas and activities, social impact assessments, crime and justice, census information"
      },
      {
        value: "structure",
        label: "structure",
        info:
          "Man-made construction <br/>Examples: buildings, museums, churches, factories, housing, monuments, shops, towers"
      },
      {
        value: "transportation",
        label: "transportation",
        info:
          "Means and aids for conveying persons and/or goods <br/>Examples: roads, airports/airstrips, shipping routes, tunnels, nautical charts, vehicle or vessel location, aeronautical charts, railways"
      },
      {
        value: "utilitiesCommunication",
        label: "utilities / communication",
        info:
          "Energy, water and waste systems and communications infrastructure and services <br/>Examples: hydroelectricity, geothermal, solar and nuclear sources of energy, water purification and distribution, sewage collection and disposal, electricity and gas distribution, data communication, telecommunication, radio, communication networks"
      }
    ]
  },
  tags_epa_theme: {
    mandatory: true,
    validators: [{ fn: global_validators.mustSelectAtLeastOneTag, args: {} }],
    availableTags: [
      { value: "Agriculture", label: "Agriculture" },
      { value: "Air", label: "Air" },
      { value: "Biology", label: "Biology" },
      { value: "Boundaries and Base Data", label: "Boundaries and Base Data" },
      { value: "Chemicals", label: "Chemicals" },
      { value: "Cleanup", label: "Cleanup" },
      { value: "Climate", label: "Climate" },
      { value: "Climate Change", label: "Climate Change" },
      { value: "Compliance", label: "Compliance" },
      { value: "Conservation", label: "Conservation" },
      { value: "Contaminant", label: "Contaminant" },
      { value: "Disaster", label: "Disaster" },
      { value: "Drinking Water", label: "Drinking Water" },
      { value: "Ecological", label: "Ecological" },
      { value: "Ecology", label: "Ecology" },
      { value: "Ecosystem", label: "Ecosystem" },
      { value: "Emergency", label: "Emergency" },
      { value: "Emergency Response", label: "Emergency Response" },
      { value: "Energy", label: "Energy" },
      { value: "Enforcement", label: "Enforcement" },
      { value: "Environment", label: "Environment" },
      { value: "Environmental Justice", label: "Environmental Justice" },
      { value: "Estuary", label: "Estuary" },
      { value: "Exposure", label: "Exposure" },
      { value: "Facilities", label: "Facilities" },
      { value: "Grants", label: "Grants" },
      { value: "Ground Water", label: "Ground Water" },
      { value: "Hazards", label: "Hazards" },
      { value: "Health", label: "Health" },
      { value: "Human", label: "Human" },
      { value: "Impact", label: "Impact" },
      { value: "Indicator", label: "Indicator" },
      { value: "Indoor Air", label: "Indoor Air" },
      { value: "Inspections", label: "Inspections" },
      { value: "Land", label: "Land" },
      { value: "Management", label: "Management" },
      { value: "Marine", label: "Marine" },
      { value: "Modeling", label: "Modeling" },
      { value: "Monitoring", label: "Monitoring" },
      { value: "Natural Resources", label: "Natural Resources" },
      { value: "Permits", label: "Permits" },
      { value: "Pesticides", label: "Pesticides" },
      { value: "Quality", label: "Quality" },
      { value: "Radiation", label: "Radiation" },
      { value: "Recreation", label: "Recreation" },
      { value: "Regulated Facilities", label: "Regulated Facilities" },
      { value: "Regulatory", label: "Regulatory" },
      { value: "Remediation", label: "Remediation" },
      { value: "Response", label: "Response" },
      { value: "Risk", label: "Risk" },
      { value: "Sites", label: "Sites" },
      { value: "Spills", label: "Spills" },
      { value: "Surface Water", label: "Surface Water" },
      { value: "Sustainability", label: "Sustainability" },
      { value: "Toxics", label: "Toxics" },
      { value: "Transportation", label: "Transportation" },
      { value: "Waste", label: "Waste" },
      { value: "Water", label: "Water" }
    ]
  },
  epa_org: {
    mandatory: false,
    validators: [],
    availableTags: []
  },
  tags_place: {
    mandatory: true,
    validators: [{ fn: global_validators.mustSelectAtLeastOneTag, args: {} }],
    availableTags: [
      { value: "United States", label: "United States" },
      { value: "Canada", label: "Canada" },
      { value: "Mexico", label: "Mexico" },
      { value: "Alaska", label: "Alaska" },
      { value: "Hawaii", label: "Hawaii" },
      { value: "Washington DC", label: "Washington DC" },
      { value: "American Samoa", label: "American Samoa" },
      { value: "Puerto Rico", label: "Puerto Rico" },
      { value: "Virgin Islands", label: "Virgin Islands" },
      { value: "Alabama", label: "Alabama" },
      { value: "Arizona", label: "Arizona" },
      { value: "Arkansas", label: "Arkansas" },
      { value: "California", label: "California" },
      { value: "Colorado", label: "Colorado" },
      { value: "Connecticut", label: "Connecticut" },
      { value: "Delaware", label: "Delaware" },
      { value: "Florida", label: "Florida" },
      { value: "Georgia", label: "Georgia" },
      { value: "Idaho", label: "Idaho" },
      { value: "Illinois", label: "Illinois" },
      { value: "Indiana", label: "Indiana" },
      { value: "Iowa", label: "Iowa" },
      { value: "Kansas", label: "Kansas" },
      { value: "Kentucky", label: "Kentucky" },
      { value: "Louisiana", label: "Louisiana" },
      { value: "Maine", label: "Maine" },
      { value: "Maryland", label: "Maryland" },
      { value: "Massachusetts", label: "Massachusetts" },
      { value: "Michigan", label: "Michigan" },
      { value: "Minnesota", label: "Minnesota" },
      { value: "Mississippi", label: "Mississippi" },
      { value: "Missouri", label: "Missouri" },
      { value: "Montana", label: "Montana" },
      { value: "Nebraska", label: "Nebraska" },
      { value: "Nevada", label: "Nevada" },
      { value: "New Hampshire", label: "New Hampshire" },
      { value: "New Jersey", label: "New Jersey" },
      { value: "New Mexico", label: "New Mexico" },
      { value: "New York", label: "New York" },
      { value: "North Carolina", label: "North Carolina" },
      { value: "North Dakota", label: "North Dakota" },
      { value: "Ohio", label: "Ohio" },
      { value: "Oklahoma", label: "Oklahoma" },
      { value: "Oregon", label: "Oregon" },
      { value: "Pennsylvania", label: "Pennsylvania" },
      { value: "Rhode Island", label: "Rhode Island" },
      { value: "South Carolina", label: "South Carolina" },
      { value: "South Dakota", label: "South Dakota" },
      { value: "Tennessee", label: "Tennessee" },
      { value: "Texas", label: "Texas" },
      { value: "Utah", label: "Utah" },
      { value: "Vermont", label: "Vermont" },
      { value: "Virginia", label: "Virginia" },
      { value: "Washington", label: "Washington" },
      { value: "West Virginia", label: "West Virginia" },
      { value: "Wisconsin", label: "Wisconsin" },
      { value: "Wyoming", label: "Wyoming" }
    ]
  },
  modified: {
    mandatory: true,
    validators: [
      {
        fn: global_validators.crossValidateModifiedAndAccrualPeriodicity,
        args: {}
      }
    ]
  },
  publisher: {
    mandatory: true,
    validators: [
      {
        fn: global_validators.nonTrivialText,
        args: { minWords: 1, minCharsinWord: 3 }
      }
    ]
  },
  contactPoint: {
    fn: {
      mandatory: true,
      validators: [
        {
          fn: global_validators.nonTrivialText,
          args: { minWords: 1, minCharsinWord: 3 }
        }
      ]
    },
    hasEmail: {
      mandatory: true,
      validators: [{ fn: global_validators.validEmail, args: {} }]
    }
  },
  identifier: {
    mandatory: true,
    validators: [{ fn: global_validators.nonEmpty, args: {} }]
  },
  accessLevel: {
    mandatory: true,
    validators: [{ fn: global_validators.nonEmpty, args: {} }],
    availableOptions: [
      { value: "public", label: "public" },
      { value: "restricted public", label: "restricted public" },
      { value: "non-public", label: "non-public" }
    ]
  },
  rights: {
    mandatory: false,
    validators: [
      {
        fn: global_validators.nonTrivialText,
        args: { minWords: 3, minCharsinWord: 3 }
      }
    ],
    availableOptions: [
      {
        value: "",
        label: ""
      },
      {
        value:
          "EPA Category: Mission Sensitive, NARA Category: Critical Infrastructure",
        label:
          "EPA Category: Mission Sensitive, NARA Category: Critical Infrastructure"
      },
      {
        value:
          "EPA Category: Drinking Water Vulnerability Assessments, NARA Category: Critical Infrastructure-Water Assessments",
        label:
          "EPA Category: Drinking Water Vulnerability Assessments, NARA Category: Critical Infrastructure-Water Assessments"
      },
      {
        value:
          "EPA Category: Sensitive Drinking Water Related, NARA Category: Critical Infrastructure-Water Assessments",
        label:
          "EPA Category: Sensitive Drinking Water Related, NARA Category: Critical Infrastructure-Water Assessments"
      },
      {
        value:
          "EPA Category: IT Security, NARA Category: Information Systems Vulnerability Information",
        label:
          "EPA Category: IT Security, NARA Category: Information Systems Vulnerability Information"
      },
      {
        value:
          "EPA Category: Law Enforcement Sensitive, NARA Category: Law Enforcement",
        label:
          "EPA Category: Law Enforcement Sensitive, NARA Category: Law Enforcement"
      },
      {
        value:
          "EPA Category: Attorney Client Privilege, NARA Category: Legal-Privilege",
        label:
          "EPA Category: Attorney Client Privilege, NARA Category: Legal-Privilege"
      },
      {
        value:
          "EPA Category: Attorney Work Product, NARA Category: Legal-Privilege",
        label:
          "EPA Category: Attorney Work Product, NARA Category: Legal-Privilege"
      },
      {
        value:
          "EPA Category: Deliberative Process Privilege, NARA Category: Legal-Privilege",
        label:
          "EPA Category: Deliberative Process Privilege, NARA Category: Legal-Privilege"
      },
      {
        value:
          "EPA Category: Personally Identifiable Information (PII), NARA Category: Privacy",
        label:
          "EPA Category: Personally Identifiable Information (PII), NARA Category: Privacy"
      },
      {
        value: "EPA Category: Proprietary, NARA Category: Proprietary",
        label: "EPA Category: Proprietary, NARA Category: Proprietary"
      },
      {
        value:
          "EPA Category: Confidential Business Information, NARA Category: Proprietary-Manufacturer",
        label:
          "EPA Category: Confidential Business Information, NARA Category: Proprietary-Manufacturer"
      },
      {
        value:
          "EPA Category: Source Selection Information, NARA Category: Proprietary-Source Selection",
        label:
          "EPA Category: Source Selection Information, NARA Category: Proprietary-Source Selection"
      }
    ]
  },
  license: {
    mandatory: true,
    validators: [{ fn: global_validators.validUrl, args: {} }]
  },
  temporal: {
    mandatory: true,
    validators: [{ fn: global_validators.validRange, args: {} }]
  },
  issued: {
    mandatory: false,
    validators: [{ fn: global_validators.validDate, args: {} }]
  },
  language: {
    mandatory: false,
    validators: [],
    maxTagsToShow: 25,
    availableTags: [
      {
        value: "en-us",
        label: "English (United States)"
      },
      {
        value: "en",
        label: "English"
      },
      {
        value: "en-gb",
        label: "English (United Kingdom)"
      },
      {
        value: "en-au",
        label: "English (Australia)"
      },
      {
        value: "en-ca",
        label: "English (Canada)"
      },
      {
        value: "en-nz",
        label: "English (New Zealand)"
      },
      {
        value: "en-ie",
        label: "English (Ireland)"
      },
      {
        value: "en-za",
        label: "English (South Africa)"
      },
      {
        value: "en-jm",
        label: "English (Jamaica)"
      },
      {
        value: "en-bz",
        label: "English (Belize)"
      },
      {
        value: "en-tt",
        label: "English (Trinidad)"
      },
      {
        value: "es",
        label: "Spanish (Spain)"
      },
      {
        value: "es-mx",
        label: "Spanish (Mexico)"
      },
      {
        value: "es-gt",
        label: "Spanish (Guatemala)"
      },
      {
        value: "es-cr",
        label: "Spanish (Costa Rica)"
      },
      {
        value: "es-pa",
        label: "Spanish (Panama)"
      },
      {
        value: "es-do",
        label: "Spanish (Dominican Republic)"
      },
      {
        value: "es-ve",
        label: "Spanish (Venezuela)"
      },
      {
        value: "es-co",
        label: "Spanish (Colombia)"
      },
      {
        value: "es-pe",
        label: "Spanish (Peru)"
      },
      {
        value: "es-ar",
        label: "Spanish (Argentina)"
      },
      {
        value: "es-ec",
        label: "Spanish (Ecuador)"
      },
      {
        value: "es-cl",
        label: "Spanish (Chile)"
      },
      {
        value: "es-uy",
        label: "Spanish (Uruguay)"
      },
      {
        value: "es-py",
        label: "Spanish (Paraguay)"
      },
      {
        value: "es-bo",
        label: "Spanish (Bolivia)"
      },
      {
        value: "es-sv",
        label: "Spanish (El Salvador)"
      },
      {
        value: "es-hn",
        label: "Spanish (Honduras)"
      },
      {
        value: "es-ni",
        label: "Spanish (Nicaragua)"
      },
      {
        value: "es-pr",
        label: "Spanish (Puerto Rico)"
      },
      {
        value: "fr",
        label: "French (Standard)"
      },
      {
        value: "fr-be",
        label: "French (Belgium)"
      },
      {
        value: "fr-ca",
        label: "French (Canada)"
      },
      {
        value: "fr-ch",
        label: "French (Switzerland)"
      },
      {
        value: "fr-lu",
        label: "French (Luxembourg)"
      },
      {
        value: "af",
        label: "Afrikaans"
      },
      {
        value: "sq",
        label: "Albanian"
      },
      {
        value: "ar-sa",
        label: "Arabic (Saudi Arabia)"
      },
      {
        value: "ar-iq",
        label: "Arabic (Iraq)"
      },
      {
        value: "ar-eg",
        label: "Arabic (Egypt)"
      },
      {
        value: "ar-ly",
        label: "Arabic (Libya)"
      },
      {
        value: "ar-dz",
        label: "Arabic (Algeria)"
      },
      {
        value: "ar-ma",
        label: "Arabic (Morocco)"
      },
      {
        value: "ar-tn",
        label: "Arabic (Tunisia)"
      },
      {
        value: "ar-om",
        label: "Arabic (Oman)"
      },
      {
        value: "ar-ye",
        label: "Arabic (Yemen)"
      },
      {
        value: "ar-sy",
        label: "Arabic (Syria)"
      },
      {
        value: "ar-jo",
        label: "Arabic (Jordan)"
      },
      {
        value: "ar-lb",
        label: "Arabic (Lebanon)"
      },
      {
        value: "ar-kw",
        label: "Arabic (Kuwait)"
      },
      {
        value: "ar-ae",
        label: "Arabic (U.A.E.)"
      },
      {
        value: "ar-bh",
        label: "Arabic (Bahrain)"
      },
      {
        value: "ar-qa",
        label: "Arabic (Qatar)"
      },
      {
        value: "eu",
        label: "Basque (Basque)"
      },
      {
        value: "bg",
        label: "Bulgarian"
      },
      {
        value: "be",
        label: "Belarusian"
      },
      {
        value: "ca",
        label: "Catalan"
      },
      {
        value: "zh-tw",
        label: "Chinese (Taiwan)"
      },
      {
        value: "zh-cn",
        label: "Chinese (PRC)"
      },
      {
        value: "zh-hk",
        label: "Chinese (Hong Kong SAR)"
      },
      {
        value: "zh-sg",
        label: "Chinese (Singapore)"
      },
      {
        value: "hr",
        label: "Croatian"
      },
      {
        value: "cs",
        label: "Czech"
      },
      {
        value: "da",
        label: "Danish"
      },
      {
        value: "nl",
        label: "Dutch (Standard)"
      },
      {
        value: "nl-be",
        label: "Dutch (Belgium)"
      },
      {
        value: "et",
        label: "Estonian"
      },
      {
        value: "fo",
        label: "Faeroese"
      },
      {
        value: "fa",
        label: "Farsi"
      },
      {
        value: "fi",
        label: "Finnish"
      },
      {
        value: "gd",
        label: "Gaelic (Scotland)"
      },
      {
        value: "ga",
        label: "Irish"
      },
      {
        value: "de",
        label: "German (Standard)"
      },
      {
        value: "de-ch",
        label: "German (Switzerland)"
      },
      {
        value: "de-at",
        label: "German (Austria)"
      },
      {
        value: "de-lu",
        label: "German (Luxembourg)"
      },
      {
        value: "de-li",
        label: "German (Liechtenstein)"
      },
      {
        value: "el",
        label: "Greek"
      },
      {
        value: "he",
        label: "Hebrew"
      },
      {
        value: "hi",
        label: "Hindi"
      },
      {
        value: "hu",
        label: "Hungarian"
      },
      {
        value: "is",
        label: "Icelandic"
      },
      {
        value: "id",
        label: "Indonesian"
      },
      {
        value: "it",
        label: "Italian (Standard)"
      },
      {
        value: "it-ch",
        label: "Italian (Switzerland)"
      },
      {
        value: "ja",
        label: "Japanese"
      },
      {
        value: "ko",
        label: "Korean"
      },
      {
        value: "lv",
        label: "Latvian"
      },
      {
        value: "lt",
        label: "Lithuanian"
      },
      {
        value: "mk",
        label: "Macedonian (FYROM)"
      },
      {
        value: "ms",
        label: "Malaysian"
      },
      {
        value: "mt",
        label: "Maltese"
      },
      {
        value: "no",
        label: "Norwegian"
      },
      {
        value: "pl",
        label: "Polish"
      },
      {
        value: "pt-br",
        label: "Portuguese (Brazil)"
      },
      {
        value: "pt",
        label: "Portuguese (Portugal)"
      },
      {
        value: "rm",
        label: "Rhaeto-Romanic "
      },
      {
        value: "ro",
        label: "Romanian"
      },
      {
        value: "ro-mo",
        label: "Romanian (Republic of Moldova)"
      },
      {
        value: "ru",
        label: "Russian"
      },
      {
        value: "ru-mo",
        label: "Russian (Republic of Moldova)"
      },
      {
        value: "sz",
        label: "Sami (Lappish)"
      },
      {
        value: "sr",
        label: "Serbian"
      },
      {
        value: "sk",
        label: "Slovak"
      },
      {
        value: "sl",
        label: "Slovenian"
      },
      {
        value: "sb",
        label: "Sorbian"
      },
      {
        value: "sx",
        label: "Sutu"
      },
      {
        value: "sv",
        label: "Swedish"
      },
      {
        value: "sv-fi",
        label: "Swedish (Finland)"
      },
      {
        value: "th",
        label: "Thai"
      },
      {
        value: "ts",
        label: "Tsonga"
      },
      {
        value: "tn",
        label: "Tswana"
      },
      {
        value: "tr",
        label: "Turkish"
      },
      {
        value: "uk",
        label: "Ukrainian"
      },
      {
        value: "ur",
        label: "Urdu"
      },
      {
        value: "ve",
        label: "Venda"
      },
      {
        value: "vi",
        label: "Vietvaluese"
      },
      {
        value: "xh",
        label: "Xhosa"
      },
      {
        value: "ji",
        label: "Yiddish"
      },
      {
        value: "zu",
        label: "Zulu"
      }
    ]
  },
  dataQuality: {
    mandatory: false,
    validators: []
  },
  epa_theme: {
    mandatory: false,
    validators: [],
    availableTags: [
      { value: "Agriculture", label: "Agriculture" },
      { value: "Air", label: "Air" },
      { value: "Biology", label: "Biology" },
      { value: "Boundaries and Base Data", label: "Boundaries and Base Data" },
      { value: "Chemicals", label: "Chemicals" },
      { value: "Cleanup", label: "Cleanup" },
      { value: "Climate", label: "Climate" },
      { value: "Climate Change", label: "Climate Change" },
      { value: "Compliance", label: "Compliance" },
      { value: "Conservation", label: "Conservation" },
      { value: "Contaminant", label: "Contaminant" },
      { value: "Disaster", label: "Disaster" },
      { value: "Drinking Water", label: "Drinking Water" },
      { value: "Ecological", label: "Ecological" },
      { value: "Ecology", label: "Ecology" },
      { value: "Ecosystem", label: "Ecosystem" },
      { value: "Emergency", label: "Emergency" },
      { value: "Emergency Response", label: "Emergency Response" },
      { value: "Energy", label: "Energy" },
      { value: "Enforcement", label: "Enforcement" },
      { value: "Environment", label: "Environment" },
      { value: "Environmental Justice", label: "Environmental Justice" },
      { value: "Estuary", label: "Estuary" },
      { value: "Exposure", label: "Exposure" },
      { value: "Facilities", label: "Facilities" },
      { value: "Grants", label: "Grants" },
      { value: "Ground Water", label: "Ground Water" },
      { value: "Hazards", label: "Hazards" },
      { value: "Health", label: "Health" },
      { value: "Human", label: "Human" },
      { value: "Impact", label: "Impact" },
      { value: "Indicator", label: "Indicator" },
      { value: "Indoor Air", label: "Indoor Air" },
      { value: "Inspections", label: "Inspections" },
      { value: "Land", label: "Land" },
      { value: "Management", label: "Management" },
      { value: "Marine", label: "Marine" },
      { value: "Modeling", label: "Modeling" },
      { value: "Monitoring", label: "Monitoring" },
      { value: "Natural Resources", label: "Natural Resources" },
      { value: "Permits", label: "Permits" },
      { value: "Pesticides", label: "Pesticides" },
      { value: "Quality", label: "Quality" },
      { value: "Radiation", label: "Radiation" },
      { value: "Recreation", label: "Recreation" },
      { value: "Regulated Facilities", label: "Regulated Facilities" },
      { value: "Regulatory", label: "Regulatory" },
      { value: "Remediation", label: "Remediation" },
      { value: "Response", label: "Response" },
      { value: "Risk", label: "Risk" },
      { value: "Sites", label: "Sites" },
      { value: "Spills", label: "Spills" },
      { value: "Surface Water", label: "Surface Water" },
      { value: "Sustainability", label: "Sustainability" },
      { value: "Toxics", label: "Toxics" },
      { value: "Transportation", label: "Transportation" },
      { value: "Waste", label: "Waste" },
      { value: "Water", label: "Water" }
    ]
  },
  accrualPeriodicity: {
    mandatory: false,
    validators: [
      {
        fn: global_validators.crossValidateModifiedAndAccrualPeriodicity,
        args: {}
      }
    ]
  },
  conformsTo: {
    mandatory: false,
    validators: [
      {
        fn: global_validators.validUrl,
        args: {}
      }
    ]
  },
  describedBy: {
    mandatory: false,
    validators: [
      {
        fn: global_validators.validUrl,
        args: {}
      }
    ]
  },
  describedByType: {
    mandatory: false,
    validators: [],
    availableOptions: [
      {
        value: "",
        label: ""
      },
      {
        value: "application/vnd.hzn-3d-crossword",
        label: "3D Crossword Plugin (.x3d)"
      },
      { value: "video/3gpp", label: "3GP (.3gp)" },
      { value: "video/3gpp2", label: "3GP2 (.3g2)" },
      { value: "application/vnd.mseq", label: "3GPP MSEQ File (.mseq)" },
      {
        value: "application/vnd.3m.post-it-notes",
        label: "3M Post It Notes (.pwn)"
      },
      {
        value: "application/vnd.3gpp.pic-bw-large",
        label: "3rd Generation Partnership Project - Pic Large (.plb)"
      },
      {
        value: "application/vnd.3gpp.pic-bw-small",
        label: "3rd Generation Partnership Project - Pic Small (.psb)"
      },
      {
        value: "application/vnd.3gpp.pic-bw-var",
        label: "3rd Generation Partnership Project - Pic Var (.pvb)"
      },
      {
        value: "application/vnd.3gpp2.tcap",
        label:
          "3rd Generation Partnership Project - Transaction Capabilities Application Part (.tcap)"
      },
      { value: "application/x-7z-compressed", label: "7-Zip (.7z)" },
      { value: "application/x-abiword", label: "AbiWord (.abw)" },
      { value: "application/x-ace-compressed", label: "Ace Archive (.ace)" },
      {
        value: "application/vnd.americandynamics.acc",
        label: "Active Content Compression (.acc)"
      },
      { value: "application/vnd.acucobol", label: "ACU Cobol (.acu)" },
      { value: "application/vnd.acucorp", label: "ACU Cobol (.atc)" },
      {
        value: "audio/adpcm",
        label: "Adaptive differential pulse-code modulation (.adp)"
      },
      {
        value: "application/x-authorware-bin",
        label: "Adobe (Macropedia) Authorware - Binary File (.aab)"
      },
      {
        value: "application/x-authorware-map",
        label: "Adobe (Macropedia) Authorware - Map (.aam)"
      },
      {
        value: "application/x-authorware-seg",
        label: "Adobe (Macropedia) Authorware - Segment File (.aas)"
      },
      {
        value: "application/vnd.adobe.air-application-installer-package+zip",
        label: "Adobe AIR Application (.air)"
      },
      { value: "application/x-shockwave-flash", label: "Adobe Flash (.swf)" },
      {
        value: "application/vnd.adobe.fxp",
        label: "Adobe Flex Project (.fxp)"
      },
      {
        value: "application/pdf",
        label: "Adobe Portable Document Format (.pdf)"
      },
      {
        value: "application/vnd.cups-ppd",
        label: "Adobe PostScript Printer Description File Format (.ppd)"
      },
      {
        value: "application/x-director",
        label: "Adobe Shockwave Player (.dir)"
      },
      {
        value: "application/vnd.adobe.xdp+xml",
        label: "Adobe XML Data Package (.xdp)"
      },
      {
        value: "application/vnd.adobe.xfdf",
        label: "Adobe XML Forms Data Format (.xfdf)"
      },
      { value: "audio/x-aac", label: "Advanced Audio Coding (AAC) (.aac)" },
      {
        value: "application/vnd.ahead.space",
        label: "Ahead AIR Application (.ahead)"
      },
      {
        value: "application/vnd.airzip.filesecure.azf",
        label: "AirZip FileSECURE (.azf)"
      },
      {
        value: "application/vnd.airzip.filesecure.azs",
        label: "AirZip FileSECURE (.azs)"
      },
      {
        value: "application/vnd.amazon.ebook",
        label: "Amazon Kindle eBook format (.azw)"
      },
      { value: "application/vnd.amiga.ami", label: "AmigaDE (.ami)" },
      { value: "application/andrew-inset", label: "Andrew Toolkit (N/A)" },
      {
        value: "application/vnd.android.package-archive",
        label: "Android Package Archive (.apk)"
      },
      {
        value: "application/vnd.anser-web-certificate-issue-initiation",
        label: "ANSER-WEB Terminal Client - Certificate Issue (.cii)"
      },
      {
        value: "application/vnd.anser-web-funds-transfer-initiation",
        label: "ANSER-WEB Terminal Client - Web Funds Transfer (.fti)"
      },
      {
        value: "application/vnd.antix.game-component",
        label: "Antix Game Player (.atx)"
      },
      {
        value: "application/x-apple-diskimage",
        label: "Apple Disk Image (.dmg)"
      },
      {
        value: "application/vnd.apple.installer+xml",
        label: "Apple Installer Package (.mpkg)"
      },
      { value: "application/applixware", label: "Applixware (.aw)" },
      {
        value: "application/vnd.hhe.lesson-player",
        label: "Archipelago Lesson Player (.les)"
      },
      {
        value: "application/vnd.aristanetworks.swi",
        label: "Arista Networks Software Image (.swi)"
      },
      { value: "text/x-asm", label: "Assembler Source File (.s)" },
      {
        value: "application/atomcat+xml",
        label: "Atom Publishing Protocol (.atomcat)"
      },
      {
        value: "application/atomsvc+xml",
        label: "Atom Publishing Protocol Service Document (.atomsvc)"
      },
      {
        value: "application/atom+xml",
        label: "Atom Syndication Format (.atom, .xml)"
      },
      {
        value: "application/pkix-attr-cert",
        label: "Attribute Certificate (.ac)"
      },
      { value: "audio/x-aiff", label: "Audio Interchange File Format (.aif)" },
      {
        value: "video/x-msvideo",
        label: "Audio Video Interleave (AVI) (.avi)"
      },
      { value: "application/vnd.audiograph", label: "Audiograph (.aep)" },
      { value: "image/vnd.dxf", label: "AutoCAD DXF (.dxf)" },
      {
        value: "model/vnd.dwf",
        label: "Autodesk Design Web Format (DWF) (.dwf)"
      },
      { value: "text/plain-bas", label: "BAS Partitur Format (.par)" },
      { value: "application/x-bcpio", label: "Binary CPIO Archive (.bcpio)" },
      { value: "application/octet-stream", label: "Binary Data (.bin)" },
      { value: "image/bmp", label: "Bitmap Image File (.bmp)" },
      { value: "application/x-bittorrent", label: "BitTorrent (.torrent)" },
      { value: "application/vnd.rim.cod", label: "Blackberry COD File (.cod)" },
      {
        value: "application/vnd.blueice.multipass",
        label: "Blueice Research Multipass (.mpm)"
      },
      {
        value: "application/vnd.bmi",
        label: "BMI Drawing Data Interchange (.bmi)"
      },
      { value: "application/x-sh", label: "Bourne Shell Script (.sh)" },
      { value: "image/prs.btif", label: "BTIF (.btif)" },
      {
        value: "application/vnd.businessobjects",
        label: "BusinessObjects (.rep)"
      },
      { value: "application/x-bzip", label: "Bzip Archive (.bz)" },
      { value: "application/x-bzip2", label: "Bzip2 Archive (.bz2)" },
      { value: "application/x-csh", label: "C Shell Script (.csh)" },
      { value: "text/x-c", label: "C Source File (.c)" },
      {
        value: "application/vnd.chemdraw+xml",
        label: "CambridgeSoft Chem Draw (.cdxml)"
      },
      { value: "text/css", label: "Cascading Style Sheets (CSS) (.css)" },
      { value: "chemical/x-cdx", label: "ChemDraw eXchange file (.cdx)" },
      { value: "chemical/x-cml", label: "Chemical Markup Language (.cml)" },
      {
        value: "chemical/x-csml",
        label: "Chemical Style Markup Language (.csml)"
      },
      {
        value: "application/vnd.contact.cmsg",
        label: "CIM Database (.cdbcmsg)"
      },
      {
        value: "application/vnd.claymore",
        label: "Claymore Data Files (.cla)"
      },
      { value: "application/vnd.clonk.c4group", label: "Clonk Game (.c4g)" },
      {
        value: "image/vnd.dvb.subtitle",
        label: "Close Captioning - Subtitle (.sub)"
      },
      {
        value: "application/cdmi-capability",
        label: "Cloud Data Management Interface (CDMI) - Capability (.cdmia)"
      },
      {
        value: "application/cdmi-container",
        label: "Cloud Data Management Interface (CDMI) - Contaimer (.cdmic)"
      },
      {
        value: "application/cdmi-domain",
        label: "Cloud Data Management Interface (CDMI) - Domain (.cdmid)"
      },
      {
        value: "application/cdmi-object",
        label: "Cloud Data Management Interface (CDMI) - Object (.cdmio)"
      },
      {
        value: "application/cdmi-queue",
        label: "Cloud Data Management Interface (CDMI) - Queue (.cdmiq)"
      },
      {
        value: "application/vnd.cluetrust.cartomobile-config",
        label: "ClueTrust CartoMobile - Config (.c11amc)"
      },
      {
        value: "application/vnd.cluetrust.cartomobile-config-pkg",
        label: "ClueTrust CartoMobile - Config Package (.c11amz)"
      },
      { value: "image/x-cmu-raster", label: "CMU Image (.ras)" },
      { value: "model/vnd.collada+xml", label: "COLLADA (.dae)" },
      { value: "text/csv", label: "Comma-Seperated Values (.csv)" },
      { value: "application/mac-compactpro", label: "Compact Pro (.cpt)" },
      {
        value: "application/vnd.wap.wmlc",
        label: "Compiled Wireless Markup Language (WMLC) (.wmlc)"
      },
      { value: "image/cgm", label: "Computer Graphics Metafile (.cgm)" },
      { value: "x-conference/x-cooltalk", label: "CoolTalk (.ice)" },
      { value: "image/x-cmx", label: "Corel Metafile Exchange (CMX) (.cmx)" },
      { value: "application/vnd.xara", label: "CorelXARA (.xar)" },
      { value: "application/vnd.cosmocaller", label: "CosmoCaller (.cmc)" },
      { value: "application/x-cpio", label: "CPIO Archive (.cpio)" },
      {
        value: "application/vnd.crick.clicker",
        label: "CrickSoftware - Clicker (.clkx)"
      },
      {
        value: "application/vnd.crick.clicker.keyboard",
        label: "CrickSoftware - Clicker - Keyboard (.clkk)"
      },
      {
        value: "application/vnd.crick.clicker.palette",
        label: "CrickSoftware - Clicker - Palette (.clkp)"
      },
      {
        value: "application/vnd.crick.clicker.template",
        label: "CrickSoftware - Clicker - Template (.clkt)"
      },
      {
        value: "application/vnd.crick.clicker.wordbank",
        label: "CrickSoftware - Clicker - Wordbank (.clkw)"
      },
      {
        value: "application/vnd.criticaltools.wbs+xml",
        label: "Critical Tools - PERT Chart EXPERT (.wbs)"
      },
      {
        value: "application/vnd.rig.cryptonote",
        label: "CryptoNote (.cryptonote)"
      },
      {
        value: "chemical/x-cif",
        label: "Crystallographic Interchange Format (.cif)"
      },
      { value: "chemical/x-cmdf", label: "CrystalMaker Data Format (.cmdf)" },
      { value: "application/cu-seeme", label: "CU-SeeMe (.cu)" },
      { value: "application/prs.cww", label: "CU-Writer (.cww)" },
      { value: "text/vnd.curl", label: "Curl - Applet (.curl)" },
      {
        value: "text/vnd.curl.dcurl",
        label: "Curl - Detached Applet (.dcurl)"
      },
      { value: "text/vnd.curl.mcurl", label: "Curl - Manifest File (.mcurl)" },
      { value: "text/vnd.curl.scurl", label: "Curl - Source Code (.scurl)" },
      { value: "application/vnd.curl.car", label: "CURL Applet (.car)" },
      { value: "application/vnd.curl.pcurl", label: "CURL Applet (.pcurl)" },
      {
        value: "application/vnd.yellowriver-custom-menu",
        label: "CustomMenu (.cmp)"
      },
      {
        value: "application/dssc+der",
        label:
          "Data Structure for the Security Suitability of Cryptographic Algorithms (.dssc)"
      },
      {
        value: "application/dssc+xml",
        label:
          "Data Structure for the Security Suitability of Cryptographic Algorithms (.xdssc)"
      },
      { value: "application/x-debian-package", label: "Debian Package (.deb)" },
      { value: "audio/vnd.dece.audio", label: "DECE Audio (.uva)" },
      { value: "image/vnd.dece.graphic", label: "DECE Graphic (.uvi)" },
      {
        value: "video/vnd.dece.hd",
        label: "DECE High Definition Video (.uvh)"
      },
      { value: "video/vnd.dece.mobile", label: "DECE Mobile Video (.uvm)" },
      { value: "video/vnd.uvvu.mp4", label: "DECE MP4 (.uvu)" },
      { value: "video/vnd.dece.pd", label: "DECE PD Video (.uvp)" },
      { value: "video/vnd.dece.sd", label: "DECE SD Video (.uvs)" },
      { value: "video/vnd.dece.video", label: "DECE Video (.uvv)" },
      {
        value: "application/x-dvi",
        label: "Device Independent File Format (DVI) (.dvi)"
      },
      {
        value: "application/vnd.fdsn.seed",
        label: "Digital Siesmograph Networks - SEED Datafiles (.seed)"
      },
      {
        value: "application/x-dtbook+xml",
        label: "Digital Talking Book (.dtb)"
      },
      {
        value: "application/x-dtbresource+xml",
        label: "Digital Talking Book - Resource File (.res)"
      },
      {
        value: "application/vnd.dvb.ait",
        label: "Digital Video Broadcasting (.ait)"
      },
      {
        value: "application/vnd.dvb.service",
        label: "Digital Video Broadcasting (.svc)"
      },
      { value: "audio/vnd.digital-winds", label: "Digital Winds Music (.eol)" },
      { value: "image/vnd.djvu", label: "DjVu (.djvu)" },
      {
        value: "application/xml-dtd",
        label: "Document Type Definition (.dtd)"
      },
      {
        value: "application/vnd.dolby.mlp",
        label: "Dolby Meridian Lossless Packing (.mlp)"
      },
      { value: "application/x-doom", label: "Doom Video Game (.wad)" },
      { value: "application/vnd.dpgraph", label: "DPGraph (.dpg)" },
      { value: "audio/vnd.dra", label: "DRA Audio (.dra)" },
      { value: "application/vnd.dreamfactory", label: "DreamFactory (.dfac)" },
      { value: "audio/vnd.dts", label: "DTS Audio (.dts)" },
      {
        value: "audio/vnd.dts.hd",
        label: "DTS High Definition Audio (.dtshd)"
      },
      { value: "image/vnd.dwg", label: "DWG Drawing (.dwg)" },
      { value: "application/vnd.dynageo", label: "DynaGeo (.geo)" },
      { value: "application/ecmascript", label: "ECMAScript (.es)" },
      { value: "application/vnd.ecowin.chart", label: "EcoWin Chart (.mag)" },
      { value: "image/vnd.fujixerox.edmics-mmr", label: "EDMICS 2000 (.mmr)" },
      { value: "image/vnd.fujixerox.edmics-rlc", label: "EDMICS 2000 (.rlc)" },
      { value: "application/exi", label: "Efficient XML Interchange (.exi)" },
      {
        value: "application/vnd.proteus.magazine",
        label: "EFI Proteus (.mgz)"
      },
      {
        value: "application/epub+zip",
        label: "Electronic Publication (.epub)"
      },
      { value: "message/rfc822", label: "Email Message (.eml)" },
      { value: "application/vnd.enliven", label: "Enliven Viewer (.nml)" },
      { value: "application/vnd.is-xpr", label: "Express by Infoseek (.xpr)" },
      {
        value: "image/vnd.xiff",
        label: "eXtended Image File Format (XIFF) (.xif)"
      },
      {
        value: "application/vnd.xfdl",
        label: "Extensible Forms Description Language (.xfdl)"
      },
      {
        value: "application/emma+xml",
        label: "Extensible MultiModal Annotation (.emma)"
      },
      {
        value: "application/vnd.ezpix-album",
        label: "EZPix Secure Photo Album (.ez2)"
      },
      {
        value: "application/vnd.ezpix-package",
        label: "EZPix Secure Photo Album (.ez3)"
      },
      { value: "image/vnd.fst", label: "FAST Search & Transfer ASA (.fst)" },
      { value: "video/vnd.fvt", label: "FAST Search & Transfer ASA (.fvt)" },
      { value: "image/vnd.fastbidsheet", label: "FastBid Sheet (.fbs)" },
      {
        value: "application/vnd.denovo.fcselayout-link",
        label: "FCS Express Layout Link (.fe_launch)"
      },
      { value: "video/x-f4v", label: "Flash Video (.f4v)" },
      { value: "video/x-flv", label: "Flash Video (.flv)" },
      { value: "image/vnd.fpx", label: "FlashPix (.fpx)" },
      { value: "image/vnd.net-fpx", label: "FlashPix (.npx)" },
      { value: "text/vnd.fmi.flexstor", label: "FLEXSTOR (.flx)" },
      { value: "video/x-fli", label: "FLI/FLC Animation Format (.fli)" },
      { value: "application/vnd.fluxtime.clip", label: "FluxTime Clip (.ftc)" },
      { value: "application/vnd.fdf", label: "Forms Data Format (.fdf)" },
      { value: "text/x-fortran", label: "Fortran Source File (.f)" },
      {
        value: "application/vnd.mif",
        label: "FrameMaker Interchange Format (.mif)"
      },
      {
        value: "application/vnd.framemaker",
        label: "FrameMaker Normal Format (.fm)"
      },
      { value: "image/x-freehand", label: "FreeHand MX (.fh)" },
      {
        value: "application/vnd.fsc.weblaunch",
        label: "Friendly Software Corporation (.fsc)"
      },
      { value: "application/vnd.frogans.fnc", label: "Frogans Player (.fnc)" },
      { value: "application/vnd.frogans.ltf", label: "Frogans Player (.ltf)" },
      {
        value: "application/vnd.fujixerox.ddd",
        label: "Fujitsu - Xerox 2D CAD Data (.ddd)"
      },
      {
        value: "application/vnd.fujixerox.docuworks",
        label: "Fujitsu - Xerox DocuWorks (.xdw)"
      },
      {
        value: "application/vnd.fujixerox.docuworks.binder",
        label: "Fujitsu - Xerox DocuWorks Binder (.xbd)"
      },
      { value: "application/vnd.fujitsu.oasys", label: "Fujitsu Oasys (.oas)" },
      {
        value: "application/vnd.fujitsu.oasys2",
        label: "Fujitsu Oasys (.oa2)"
      },
      {
        value: "application/vnd.fujitsu.oasys3",
        label: "Fujitsu Oasys (.oa3)"
      },
      {
        value: "application/vnd.fujitsu.oasysgp",
        label: "Fujitsu Oasys (.fg5)"
      },
      {
        value: "application/vnd.fujitsu.oasysprs",
        label: "Fujitsu Oasys (.bh2)"
      },
      {
        value: "application/x-futuresplash",
        label: "FutureSplash Animator (.spl)"
      },
      { value: "application/vnd.fuzzysheet", label: "FuzzySheet (.fzs)" },
      { value: "image/g3fax", label: "G3 Fax Image (.g3)" },
      { value: "application/vnd.gmx", label: "GameMaker ActiveX (.gmx)" },
      { value: "model/vnd.gtw", label: "Gen-Trix Studio (.gtw)" },
      {
        value: "application/vnd.genomatix.tuxedo",
        label: "Genomatix Tuxedo Framework (.txd)"
      },
      { value: "application/vnd.geogebra.file", label: "GeoGebra (.ggb)" },
      { value: "application/vnd.geogebra.tool", label: "GeoGebra (.ggt)" },
      {
        value: "model/vnd.gdl",
        label: "Geometric Description Language (GDL) (.gdl)"
      },
      {
        value: "application/vnd.geometry-explorer",
        label: "GeoMetry Explorer (.gex)"
      },
      {
        value: "application/vnd.geonext",
        label: "GEONExT and JSXGraph (.gxt)"
      },
      { value: "application/vnd.geoplan", label: "GeoplanW (.g2w)" },
      { value: "application/vnd.geospace", label: "GeospacW (.g3w)" },
      {
        value: "application/x-font-ghostscript",
        label: "Ghostscript Font (.gsf)"
      },
      {
        value: "application/x-font-bdf",
        label: "Glyph Bitmap Distribution Format (.bdf)"
      },
      { value: "application/x-gtar", label: "GNU Tar Files (.gtar)" },
      {
        value: "application/x-texinfo",
        label: "GNU Texinfo Document (.texinfo)"
      },
      { value: "application/x-gnumeric", label: "Gnumeric (.gnumeric)" },
      {
        value: "application/vnd.google-earth.kml+xml",
        label: "Google Earth - KML (.kml)"
      },
      {
        value: "application/vnd.google-earth.kmz",
        label: "Google Earth - Zipped KML (.kmz)"
      },
      { value: "application/vnd.grafeq", label: "GrafEq (.gqf)" },
      { value: "image/gif", label: "Graphics Interchange Format (.gif)" },
      { value: "text/vnd.graphviz", label: "Graphviz (.gv)" },
      {
        value: "application/vnd.groove-account",
        label: "Groove - Account (.gac)"
      },
      { value: "application/vnd.groove-help", label: "Groove - Help (.ghf)" },
      {
        value: "application/vnd.groove-identity-message",
        label: "Groove - Identity Message (.gim)"
      },
      {
        value: "application/vnd.groove-injector",
        label: "Groove - Injector (.grv)"
      },
      {
        value: "application/vnd.groove-tool-message",
        label: "Groove - Tool Message (.gtm)"
      },
      {
        value: "application/vnd.groove-tool-template",
        label: "Groove - Tool Template (.tpl)"
      },
      { value: "application/vnd.groove-vcard", label: "Groove - Vcard (.vcg)" },
      { value: "video/h261", label: "H.261 (.h261)" },
      { value: "video/h263", label: "H.263 (.h263)" },
      { value: "video/h264", label: "H.264 (.h264)" },
      {
        value: "application/vnd.hp-hpid",
        label: "Hewlett Packard Instant Delivery (.hpid)"
      },
      {
        value: "application/vnd.hp-hps",
        label: "Hewlett-Packard's WebPrintSmart (.hps)"
      },
      { value: "application/x-hdf", label: "Hierarchical Data Format (.hdf)" },
      { value: "audio/vnd.rip", label: "Hit'n'Mix (.rip)" },
      {
        value: "application/vnd.hbci",
        label: "Homebanking Computer Interface (HBCI) (.hbci)"
      },
      {
        value: "application/vnd.hp-jlyt",
        label: "HP Indigo Digital Press - Job Layout Languate (.jlt)"
      },
      {
        value: "application/vnd.hp-pcl",
        label: "HP Printer Command Language (.pcl)"
      },
      { value: "application/vnd.hp-hpgl", label: "HP-GL/2 and HP RTL (.hpgl)" },
      { value: "application/vnd.yamaha.hv-script", label: "HV Script (.hvs)" },
      {
        value: "application/vnd.yamaha.hv-dic",
        label: "HV Voice Dictionary (.hvd)"
      },
      {
        value: "application/vnd.yamaha.hv-voice",
        label: "HV Voice Parameter (.hvp)"
      },
      {
        value: "application/vnd.hydrostatix.sof-data",
        label: "Hydrostatix Master Suite (.sfd-hdstx)"
      },
      { value: "application/hyperstudio", label: "Hyperstudio (.stk)" },
      {
        value: "application/vnd.hal+xml",
        label: "Hypertext Application Language (.hal)"
      },
      { value: "text/html", label: "HyperText Markup Language (HTML) (.html)" },
      {
        value: "application/vnd.ibm.rights-management",
        label: "IBM DB2 Rights Manager (.irm)"
      },
      {
        value: "application/vnd.ibm.secure-container",
        label: "IBM Electronic Media Management System - Secure Container (.sc)"
      },
      { value: "text/calendar", label: "iCalendar (.ics)" },
      { value: "application/vnd.iccprofile", label: "ICC profile (.icc)" },
      { value: "image/x-icon", label: "Icon Image (.ico)" },
      { value: "application/vnd.igloader", label: "igLoader (.igl)" },
      { value: "image/ief", label: "Image Exchange Format (.ief)" },
      {
        value: "application/vnd.immervision-ivp",
        label: "ImmerVision PURE Players (.ivp)"
      },
      {
        value: "application/vnd.immervision-ivu",
        label: "ImmerVision PURE Players (.ivu)"
      },
      { value: "application/reginfo+xml", label: "IMS Networks (.rif)" },
      { value: "text/vnd.in3d.3dml", label: "In3D - 3DML (.3dml)" },
      { value: "text/vnd.in3d.spot", label: "In3D - 3DML (.spot)" },
      {
        value: "model/iges",
        label: "Initial Graphics Exchange Specification (IGES) (.igs)"
      },
      {
        value: "application/vnd.intergeo",
        label: "Interactive Geometry Software (.i2g)"
      },
      {
        value: "application/vnd.cinderella",
        label: "Interactive Geometry Software Cinderella (.cdy)"
      },
      {
        value: "application/vnd.intercon.formnet",
        label: "Intercon FormNet (.xpw)"
      },
      {
        value: "application/vnd.isac.fcs",
        label: "International Society for Advancement of Cytometry (.fcs)"
      },
      {
        value: "application/ipfix",
        label: "Internet Protocol Flow Information Export (.ipfix)"
      },
      {
        value: "application/pkix-cert",
        label: "Internet Public Key Infrastructure - Certificate (.cer)"
      },
      {
        value: "application/pkixcmp",
        label:
          "Internet Public Key Infrastructure - Certificate Management Protocole (.pki)"
      },
      {
        value: "application/pkix-crl",
        label:
          "Internet Public Key Infrastructure - Certificate Revocation Lists (.crl)"
      },
      {
        value: "application/pkix-pkipath",
        label:
          "Internet Public Key Infrastructure - Certification Path (.pkipath)"
      },
      { value: "application/vnd.insors.igm", label: "IOCOM Visimeet (.igm)" },
      {
        value: "application/vnd.ipunplugged.rcprofile",
        label: "IP Unplugged Roaming Client (.rcprofile)"
      },
      {
        value: "application/vnd.irepository.package+xml",
        label: "iRepository / Lucidoc Editor (.irp)"
      },
      {
        value: "text/vnd.sun.j2me.app-descriptor",
        label: "J2ME App Descriptor (.jad)"
      },
      { value: "application/java-archive", label: "Java Archive (.jar)" },
      { value: "application/java-vm", label: "Java Bytecode File (.class)" },
      {
        value: "application/x-java-jnlp-file",
        label: "Java Network Launching Protocol (.jnlp)"
      },
      {
        value: "application/java-serialized-object",
        label: "Java Serialized Object (.ser)"
      },
      { value: "text/x-java-source,java", label: "Java Source File (.java)" },
      { value: "application/javascript", label: "JavaScript (.js)" },
      {
        value: "application/json",
        label: "JavaScript Object Notation (JSON) (.json)"
      },
      {
        value: "application/vnd.joost.joda-archive",
        label: "Joda Archive (.joda)"
      },
      {
        value: "video/jpm",
        label: "JPEG 2000 Compound Image File Format (.jpm)"
      },
      { value: "image/jpeg", label: "JPEG Image (.jpeg, .jpg)" },
      {
        value: "image/x-citrix-jpeg",
        label: "JPEG Image (Citrix client) (.jpeg, .jpg)"
      },
      { value: "image/pjpeg", label: "JPEG Image (Progressive) (.pjpeg)" },
      { value: "video/jpeg", label: "JPGVideo (.jpgv)" },
      { value: "application/vnd.kahootz", label: "Kahootz (.ktz)" },
      {
        value: "application/vnd.chipnuts.karaoke-mmd",
        label: "Karaoke on Chipnuts Chipsets (.mmd)"
      },
      {
        value: "application/vnd.kde.karbon",
        label: "KDE KOffice Office Suite - Karbon (.karbon)"
      },
      {
        value: "application/vnd.kde.kchart",
        label: "KDE KOffice Office Suite - KChart (.chrt)"
      },
      {
        value: "application/vnd.kde.kformula",
        label: "KDE KOffice Office Suite - Kformula (.kfo)"
      },
      {
        value: "application/vnd.kde.kivio",
        label: "KDE KOffice Office Suite - Kivio (.flw)"
      },
      {
        value: "application/vnd.kde.kontour",
        label: "KDE KOffice Office Suite - Kontour (.kon)"
      },
      {
        value: "application/vnd.kde.kpresenter",
        label: "KDE KOffice Office Suite - Kpresenter (.kpr)"
      },
      {
        value: "application/vnd.kde.kspread",
        label: "KDE KOffice Office Suite - Kspread (.ksp)"
      },
      {
        value: "application/vnd.kde.kword",
        label: "KDE KOffice Office Suite - Kword (.kwd)"
      },
      { value: "application/vnd.kenameaapp", label: "Kenamea App (.htke)" },
      { value: "application/vnd.kidspiration", label: "Kidspiration (.kia)" },
      { value: "application/vnd.kinar", label: "Kinar Applications (.kne)" },
      {
        value: "application/vnd.kodak-descriptor",
        label: "Kodak Storyshare (.sse)"
      },
      {
        value: "application/vnd.las.las+xml",
        label: "Laser App Enterprise (.lasxml)"
      },
      { value: "application/x-latex", label: "LaTeX (.latex)" },
      {
        value: "application/vnd.llamagraphics.life-balance.desktop",
        label: "Life Balance - Desktop Edition (.lbd)"
      },
      {
        value: "application/vnd.llamagraphics.life-balance.exchange+xml",
        label: "Life Balance - Exchange Format (.lbe)"
      },
      { value: "application/vnd.jam", label: "Lightspeed Audio Lab (.jam)" },
      { value: "application/vnd.lotus-1-2-3", label: "Lotus 1-2-3 (0.123)" },
      {
        value: "application/vnd.lotus-approach",
        label: "Lotus Approach (.apr)"
      },
      {
        value: "application/vnd.lotus-freelance",
        label: "Lotus Freelance (.pre)"
      },
      { value: "application/vnd.lotus-notes", label: "Lotus Notes (.nsf)" },
      {
        value: "application/vnd.lotus-organizer",
        label: "Lotus Organizer (.org)"
      },
      {
        value: "application/vnd.lotus-screencam",
        label: "Lotus Screencam (.scm)"
      },
      { value: "application/vnd.lotus-wordpro", label: "Lotus Wordpro (.lwp)" },
      { value: "audio/vnd.lucent.voice", label: "Lucent Voice (.lvp)" },
      { value: "audio/x-mpegurl", label: "M3U (Multimedia Playlist) (.m3u)" },
      { value: "video/x-m4v", label: "M4v (.m4v)" },
      {
        value: "application/mac-binhex40",
        label: "Macintosh BinHex 4.0 (.hqx)"
      },
      {
        value: "application/vnd.macports.portpkg",
        label: "MacPorts Port System (.portpkg)"
      },
      {
        value: "application/vnd.osgeo.mapguide.package",
        label: "MapGuide DBXML (.mgp)"
      },
      { value: "application/marc", label: "MARC Formats (.mrc)" },
      { value: "application/marcxml+xml", label: "MARC21 XML Schema (.mrcx)" },
      { value: "application/mxf", label: "Material Exchange Format (.mxf)" },
      {
        value: "application/vnd.wolfram.player",
        label: "Mathematica Notebook Player (.nbp)"
      },
      {
        value: "application/mathematica",
        label: "Mathematica Notebooks (.ma)"
      },
      {
        value: "application/mathml+xml",
        label: "Mathematical Markup Language (.mathml)"
      },
      { value: "application/mbox", label: "Mbox database files (.mbox)" },
      { value: "application/vnd.medcalcdata", label: "MedCalc (.mc1)" },
      {
        value: "application/mediaservercontrol+xml",
        label: "Media Server Control Markup Language (.mscml)"
      },
      {
        value: "application/vnd.mediastation.cdkey",
        label: "MediaRemote (.cdkey)"
      },
      {
        value: "application/vnd.mfer",
        label: "Medical Waveform Encoding Format (.mwf)"
      },
      {
        value: "application/vnd.mfmp",
        label: "Melody Format for Mobile Platform (.mfm)"
      },
      { value: "model/mesh", label: "Mesh Data Type (.msh)" },
      {
        value: "application/mads+xml",
        label: "Metadata Authority Description Schema (.mads)"
      },
      {
        value: "application/mets+xml",
        label: "Metadata Encoding and Transmission Standard (.mets)"
      },
      {
        value: "application/mods+xml",
        label: "Metadata Object Description Schema (.mods)"
      },
      { value: "application/metalink4+xml", label: "Metalink (.meta4)" },
      { value: "application/vnd.mcd", label: "Micro CADAM Helix D&D (.mcd)" },
      { value: "application/vnd.micrografx.flo", label: "Micrografx (.flo)" },
      {
        value: "application/vnd.micrografx.igx",
        label: "Micrografx iGrafx Professional (.igx)"
      },
      {
        value: "application/vnd.eszigno3+xml",
        label: "MICROSEC e-Szign¢ (.es3)"
      },
      { value: "application/x-msaccess", label: "Microsoft Access (.mdb)" },
      {
        value: "video/x-ms-asf",
        label: "Microsoft Advanced Systems Format (ASF) (.asf)"
      },
      {
        value: "application/x-msdownload",
        label: "Microsoft Application (.exe)"
      },
      {
        value: "application/vnd.ms-artgalry",
        label: "Microsoft Artgalry (.cil)"
      },
      {
        value: "application/vnd.ms-cab-compressed",
        label: "Microsoft Cabinet File (.cab)"
      },
      {
        value: "application/vnd.ms-ims",
        label: "Microsoft Class Server (.ims)"
      },
      {
        value: "application/x-ms-application",
        label: "Microsoft ClickOnce (.application)"
      },
      {
        value: "application/x-msclip",
        label: "Microsoft Clipboard Clip (.clp)"
      },
      {
        value: "image/vnd.ms-modi",
        label: "Microsoft Document Imaging Format (.mdi)"
      },
      {
        value: "application/vnd.ms-fontobject",
        label: "Microsoft Embedded OpenType (.eot)"
      },
      { value: "application/vnd.ms-excel", label: "Microsoft Excel (.xls)" },
      {
        value: "application/vnd.ms-excel.addin.macroenabled.12",
        label: "Microsoft Excel - Add-In File (.xlam)"
      },
      {
        value: "application/vnd.ms-excel.sheet.binary.macroenabled.12",
        label: "Microsoft Excel - Binary Workbook (.xlsb)"
      },
      {
        value: "application/vnd.ms-excel.template.macroenabled.12",
        label: "Microsoft Excel - Macro-Enabled Template File (.xltm)"
      },
      {
        value: "application/vnd.ms-excel.sheet.macroenabled.12",
        label: "Microsoft Excel - Macro-Enabled Workbook (.xlsm)"
      },
      {
        value: "application/vnd.ms-htmlhelp",
        label: "Microsoft Html Help File (.chm)"
      },
      {
        value: "application/x-mscardfile",
        label: "Microsoft Information Card (.crd)"
      },
      {
        value: "application/vnd.ms-lrm",
        label: "Microsoft Learning Resource Module (.lrm)"
      },
      {
        value: "application/x-msmediaview",
        label: "Microsoft MediaView (.mvb)"
      },
      { value: "application/x-msmoney", label: "Microsoft Money (.mny)" },
      {
        value:
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        label: "Microsoft Office - OOXML - Presentation (.pptx)"
      },
      {
        value:
          "application/vnd.openxmlformats-officedocument.presentationml.slide",
        label: "Microsoft Office - OOXML - Presentation (Slide) (.sldx)"
      },
      {
        value:
          "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
        label: "Microsoft Office - OOXML - Presentation (Slideshow) (.ppsx)"
      },
      {
        value:
          "application/vnd.openxmlformats-officedocument.presentationml.template",
        label: "Microsoft Office - OOXML - Presentation Template (.potx)"
      },
      {
        value:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        label: "Microsoft Office - OOXML - Spreadsheet (.xlsx)"
      },
      {
        value:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
        label: "Microsoft Office - OOXML - Spreadsheet Template (.xltx)"
      },
      {
        value:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        label: "Microsoft Office - OOXML - Word Document (.docx)"
      },
      {
        value:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
        label: "Microsoft Office - OOXML - Word Document Template (.dotx)"
      },
      {
        value: "application/x-msbinder",
        label: "Microsoft Office Binder (.obd)"
      },
      {
        value: "application/vnd.ms-officetheme",
        label: "Microsoft Office System Release Theme (.thmx)"
      },
      { value: "application/onenote", label: "Microsoft OneNote (.onetoc)" },
      {
        value: "audio/vnd.ms-playready.media.pya",
        label: "Microsoft PlayReady Ecosystem (.pya)"
      },
      {
        value: "video/vnd.ms-playready.media.pyv",
        label: "Microsoft PlayReady Ecosystem Video (.pyv)"
      },
      {
        value: "application/vnd.ms-powerpoint",
        label: "Microsoft PowerPoint (.ppt)"
      },
      {
        value: "application/vnd.ms-powerpoint.addin.macroenabled.12",
        label: "Microsoft PowerPoint - Add-in file (.ppam)"
      },
      {
        value: "application/vnd.ms-powerpoint.slide.macroenabled.12",
        label: "Microsoft PowerPoint - Macro-Enabled Open XML Slide (.sldm)"
      },
      {
        value: "application/vnd.ms-powerpoint.presentation.macroenabled.12",
        label: "Microsoft PowerPoint - Macro-Enabled Presentation File (.pptm)"
      },
      {
        value: "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
        label: "Microsoft PowerPoint - Macro-Enabled Slide Show File (.ppsm)"
      },
      {
        value: "application/vnd.ms-powerpoint.template.macroenabled.12",
        label: "Microsoft PowerPoint - Macro-Enabled Template File (.potm)"
      },
      {
        value: "application/vnd.ms-project",
        label: "Microsoft Project (.mpp)"
      },
      {
        value: "application/x-mspublisher",
        label: "Microsoft Publisher (.pub)"
      },
      {
        value: "application/x-msschedule",
        label: "Microsoft Schedule+ (.scd)"
      },
      {
        value: "application/x-silverlight-app",
        label: "Microsoft Silverlight (.xap)"
      },
      {
        value: "application/vnd.ms-pki.stl",
        label: "Microsoft Trust UI Provider - Certificate Trust Link (.stl)"
      },
      {
        value: "application/vnd.ms-pki.seccat",
        label: "Microsoft Trust UI Provider - Security Catalog (.cat)"
      },
      { value: "application/vnd.visio", label: "Microsoft Visio (.vsd)" },
      {
        value: "application/vnd.visio2013",
        label: "Microsoft Visio 2013 (.vsdx)"
      },
      { value: "video/x-ms-wm", label: "Microsoft Windows Media (.wm)" },
      {
        value: "audio/x-ms-wma",
        label: "Microsoft Windows Media Audio (.wma)"
      },
      {
        value: "audio/x-ms-wax",
        label: "Microsoft Windows Media Audio Redirector (.wax)"
      },
      {
        value: "video/x-ms-wmx",
        label: "Microsoft Windows Media Audio/Video Playlist (.wmx)"
      },
      {
        value: "application/x-ms-wmd",
        label: "Microsoft Windows Media Player Download Package (.wmd)"
      },
      {
        value: "application/vnd.ms-wpl",
        label: "Microsoft Windows Media Player Playlist (.wpl)"
      },
      {
        value: "application/x-ms-wmz",
        label: "Microsoft Windows Media Player Skin Package (.wmz)"
      },
      {
        value: "video/x-ms-wmv",
        label: "Microsoft Windows Media Video (.wmv)"
      },
      {
        value: "video/x-ms-wvx",
        label: "Microsoft Windows Media Video Playlist (.wvx)"
      },
      {
        value: "application/x-msmetafile",
        label: "Microsoft Windows Metafile (.wmf)"
      },
      {
        value: "application/x-msterminal",
        label: "Microsoft Windows Terminal Services (.trm)"
      },
      { value: "application/msword", label: "Microsoft Word (.doc)" },
      {
        value: "application/vnd.ms-word.document.macroenabled.12",
        label: "Microsoft Word - Macro-Enabled Document (.docm)"
      },
      {
        value: "application/vnd.ms-word.template.macroenabled.12",
        label: "Microsoft Word - Macro-Enabled Template (.dotm)"
      },
      { value: "application/x-mswrite", label: "Microsoft Wordpad (.wri)" },
      { value: "application/vnd.ms-works", label: "Microsoft Works (.wps)" },
      {
        value: "application/x-ms-xbap",
        label: "Microsoft XAML Browser Application (.xbap)"
      },
      {
        value: "application/vnd.ms-xpsdocument",
        label: "Microsoft XML Paper Specification (.xps)"
      },
      {
        value: "audio/midi",
        label: "MIDI - Musical Instrument Digital Interface (.mid)"
      },
      { value: "application/vnd.ibm.minipay", label: "MiniPay (.mpy)" },
      { value: "application/vnd.ibm.modcap", label: "MO:DCA-P (.afp)" },
      {
        value: "application/vnd.jcp.javame.midlet-rms",
        label: "Mobile Information Device Profile (.rms)"
      },
      { value: "application/vnd.tmobile-livetv", label: "MobileTV (.tmo)" },
      { value: "application/x-mobipocket-ebook", label: "Mobipocket (.prc)" },
      {
        value: "application/vnd.mobius.mbk",
        label: "Mobius Management Systems - Basket file (.mbk)"
      },
      {
        value: "application/vnd.mobius.dis",
        label: "Mobius Management Systems - Distribution Database (.dis)"
      },
      {
        value: "application/vnd.mobius.plc",
        label:
          "Mobius Management Systems - Policy Definition Language File (.plc)"
      },
      {
        value: "application/vnd.mobius.mqy",
        label: "Mobius Management Systems - Query File (.mqy)"
      },
      {
        value: "application/vnd.mobius.msl",
        label: "Mobius Management Systems - Script Language (.msl)"
      },
      {
        value: "application/vnd.mobius.txf",
        label: "Mobius Management Systems - Topic Index File (.txf)"
      },
      {
        value: "application/vnd.mobius.daf",
        label: "Mobius Management Systems - UniversalArchive (.daf)"
      },
      { value: "text/vnd.fly", label: "mod_fly / fly.cgi (.fly)" },
      {
        value: "application/vnd.mophun.certificate",
        label: "Mophun Certificate (.mpc)"
      },
      {
        value: "application/vnd.mophun.application",
        label: "Mophun VM (.mpn)"
      },
      { value: "video/mj2", label: "Motion JPEG 2000 (.mj2)" },
      { value: "audio/mpeg", label: "MPEG Audio (.mpga)" },
      { value: "video/vnd.mpegurl", label: "MPEG Url (.mxu)" },
      { value: "video/mpeg", label: "MPEG Video (.mpeg)" },
      { value: "application/mp21", label: "MPEG-21 (.m21)" },
      { value: "audio/mp4", label: "MPEG-4 Audio (.mp4a)" },
      { value: "video/mp4", label: "MPEG-4 Video (.mp4)" },
      { value: "application/mp4", label: "MPEG4 (.mp4)" },
      {
        value: "application/vnd.apple.mpegurl",
        label: "Multimedia Playlist Unicode (.m3u8)"
      },
      {
        value: "application/vnd.musician",
        label:
          "MUsical Score Interpreted Code Invented for the ASCII designation of Notation (.mus)"
      },
      {
        value: "application/vnd.muvee.style",
        label: "Muvee Automatic Video Editing (.msty)"
      },
      { value: "application/xv+xml", label: "MXML (.mxml)" },
      {
        value: "application/vnd.nokia.n-gage.data",
        label: "N-Gage Game Data (.ngdat)"
      },
      {
        value: "application/vnd.nokia.n-gage.symbian.install",
        label: "N-Gage Game Installer (.n-gage)"
      },
      {
        value: "application/x-dtbncx+xml",
        label: "Navigation Control file for XML (for ePub) (.ncx)"
      },
      {
        value: "application/x-netcdf",
        label: "Network Common Data Form (NetCDF) (.nc)"
      },
      {
        value: "application/vnd.neurolanguage.nlu",
        label: "neuroLanguage (.nlu)"
      },
      { value: "application/vnd.dna", label: "New Moon Liftoff/DNA (.dna)" },
      {
        value: "application/vnd.noblenet-directory",
        label: "NobleNet Directory (.nnd)"
      },
      {
        value: "application/vnd.noblenet-sealer",
        label: "NobleNet Sealer (.nns)"
      },
      { value: "application/vnd.noblenet-web", label: "NobleNet Web (.nnw)" },
      {
        value: "application/vnd.nokia.radio-preset",
        label: "Nokia Radio Application - Preset (.rpst)"
      },
      {
        value: "application/vnd.nokia.radio-presets",
        label: "Nokia Radio Application - Preset (.rpss)"
      },
      { value: "text/n3", label: "Notation3 (.n3)" },
      {
        value: "application/vnd.novadigm.edm",
        label: "Novadigm's RADIA and EDM products (.edm)"
      },
      {
        value: "application/vnd.novadigm.edx",
        label: "Novadigm's RADIA and EDM products (.edx)"
      },
      {
        value: "application/vnd.novadigm.ext",
        label: "Novadigm's RADIA and EDM products (.ext)"
      },
      { value: "application/vnd.flographit", label: "NpGraphIt (.gph)" },
      {
        value: "audio/vnd.nuera.ecelp4800",
        label: "Nuera ECELP 4800 (.ecelp4800)"
      },
      {
        value: "audio/vnd.nuera.ecelp7470",
        label: "Nuera ECELP 7470 (.ecelp7470)"
      },
      {
        value: "audio/vnd.nuera.ecelp9600",
        label: "Nuera ECELP 9600 (.ecelp9600)"
      },
      {
        value: "application/oda",
        label: "Office Document Architecture (.oda)"
      },
      { value: "application/ogg", label: "Ogg (.ogx)" },
      { value: "audio/ogg", label: "Ogg Audio (.oga)" },
      { value: "video/ogg", label: "Ogg Video (.ogv)" },
      {
        value: "application/vnd.oma.dd2+xml",
        label: "OMA Download Agents (.dd2)"
      },
      {
        value: "application/vnd.oasis.opendocument.text-web",
        label: "Open Document Text Web (.oth)"
      },
      {
        value: "application/oebps-package+xml",
        label: "Open eBook Publication Structure (.opf)"
      },
      {
        value: "application/vnd.intu.qbo",
        label: "Open Financial Exchange (.qbo)"
      },
      {
        value: "application/vnd.openofficeorg.extension",
        label: "Open Office Extension (.oxt)"
      },
      {
        value: "application/vnd.yamaha.openscoreformat",
        label: "Open Score Format (.osf)"
      },
      { value: "audio/webm", label: "Open Web Media Project - Audio (.weba)" },
      { value: "video/webm", label: "Open Web Media Project - Video (.webm)" },
      {
        value: "application/vnd.oasis.opendocument.chart",
        label: "OpenDocument Chart (.odc)"
      },
      {
        value: "application/vnd.oasis.opendocument.chart-template",
        label: "OpenDocument Chart Template (.otc)"
      },
      {
        value: "application/vnd.oasis.opendocument.database",
        label: "OpenDocument Database (.odb)"
      },
      {
        value: "application/vnd.oasis.opendocument.formula",
        label: "OpenDocument Formula (.odf)"
      },
      {
        value: "application/vnd.oasis.opendocument.formula-template",
        label: "OpenDocument Formula Template (.odft)"
      },
      {
        value: "application/vnd.oasis.opendocument.graphics",
        label: "OpenDocument Graphics (.odg)"
      },
      {
        value: "application/vnd.oasis.opendocument.graphics-template",
        label: "OpenDocument Graphics Template (.otg)"
      },
      {
        value: "application/vnd.oasis.opendocument.image",
        label: "OpenDocument Image (.odi)"
      },
      {
        value: "application/vnd.oasis.opendocument.image-template",
        label: "OpenDocument Image Template (.oti)"
      },
      {
        value: "application/vnd.oasis.opendocument.presentation",
        label: "OpenDocument Presentation (.odp)"
      },
      {
        value: "application/vnd.oasis.opendocument.presentation-template",
        label: "OpenDocument Presentation Template (.otp)"
      },
      {
        value: "application/vnd.oasis.opendocument.spreadsheet",
        label: "OpenDocument Spreadsheet (.ods)"
      },
      {
        value: "application/vnd.oasis.opendocument.spreadsheet-template",
        label: "OpenDocument Spreadsheet Template (.ots)"
      },
      {
        value: "application/vnd.oasis.opendocument.text",
        label: "OpenDocument Text (.odt)"
      },
      {
        value: "application/vnd.oasis.opendocument.text-master",
        label: "OpenDocument Text Master (.odm)"
      },
      {
        value: "application/vnd.oasis.opendocument.text-template",
        label: "OpenDocument Text Template (.ott)"
      },
      { value: "image/ktx", label: "OpenGL Textures (KTX) (.ktx)" },
      {
        value: "application/vnd.sun.xml.calc",
        label: "OpenOffice - Calc (Spreadsheet) (.sxc)"
      },
      {
        value: "application/vnd.sun.xml.calc.template",
        label: "OpenOffice - Calc Template (Spreadsheet) (.stc)"
      },
      {
        value: "application/vnd.sun.xml.draw",
        label: "OpenOffice - Draw (Graphics) (.sxd)"
      },
      {
        value: "application/vnd.sun.xml.draw.template",
        label: "OpenOffice - Draw Template (Graphics) (.std)"
      },
      {
        value: "application/vnd.sun.xml.impress",
        label: "OpenOffice - Impress (Presentation) (.sxi)"
      },
      {
        value: "application/vnd.sun.xml.impress.template",
        label: "OpenOffice - Impress Template (Presentation) (.sti)"
      },
      {
        value: "application/vnd.sun.xml.math",
        label: "OpenOffice - Math (Formula) (.sxm)"
      },
      {
        value: "application/vnd.sun.xml.writer",
        label: "OpenOffice - Writer (Text - HTML) (.sxw)"
      },
      {
        value: "application/vnd.sun.xml.writer.global",
        label: "OpenOffice - Writer (Text - HTML) (.sxg)"
      },
      {
        value: "application/vnd.sun.xml.writer.template",
        label: "OpenOffice - Writer Template (Text - HTML) (.stw)"
      },
      { value: "application/x-font-otf", label: "OpenType Font File (.otf)" },
      {
        value: "application/vnd.yamaha.openscoreformat.osfpvg+xml",
        label: "OSFPVG (.osfpvg)"
      },
      {
        value: "application/vnd.osgi.dp",
        label: "OSGi Deployment Package (.dp)"
      },
      { value: "application/vnd.palm", label: "PalmOS Data (.pdb)" },
      { value: "text/x-pascal", label: "Pascal Source File (.p)" },
      { value: "application/vnd.pawaafile", label: "PawaaFILE (.paw)" },
      {
        value: "application/vnd.hp-pclxl",
        label: "PCL 6 Enhanced (Formely PCL XL) (.pclxl)"
      },
      { value: "application/vnd.picsel", label: "Pcsel eFIF File (.efif)" },
      { value: "image/x-pcx", label: "PCX Image (.pcx)" },
      {
        value: "image/vnd.adobe.photoshop",
        label: "Photoshop Document (.psd)"
      },
      { value: "application/pics-rules", label: "PICSRules (.prf)" },
      { value: "image/x-pict", label: "PICT Image (.pic)" },
      { value: "application/x-chat", label: "pIRCh (.chat)" },
      {
        value: "application/pkcs10",
        label: "PKCS #10 - Certification Request Standard (.p10)"
      },
      {
        value: "application/x-pkcs12",
        label: "PKCS #12 - Personal Information Exchange Syntax Standard (.p12)"
      },
      {
        value: "application/pkcs7-mime",
        label: "PKCS #7 - Cryptographic Message Syntax Standard (.p7m)"
      },
      {
        value: "application/pkcs7-signature",
        label: "PKCS #7 - Cryptographic Message Syntax Standard (.p7s)"
      },
      {
        value: "application/x-pkcs7-certreqresp",
        label:
          "PKCS #7 - Cryptographic Message Syntax Standard (Certificate Request Response) (.p7r)"
      },
      {
        value: "application/x-pkcs7-certificates",
        label:
          "PKCS #7 - Cryptographic Message Syntax Standard (Certificates) (.p7b)"
      },
      {
        value: "application/pkcs8",
        label: "PKCS #8 - Private-Key Information Syntax Standard (.p8)"
      },
      {
        value: "application/vnd.pocketlearn",
        label: "PocketLearn Viewers (.plf)"
      },
      {
        value: "image/x-portable-anymap",
        label: "Portable Anymap Image (.pnm)"
      },
      {
        value: "image/x-portable-bitmap",
        label: "Portable Bitmap Format (.pbm)"
      },
      {
        value: "application/x-font-pcf",
        label: "Portable Compiled Format (.pcf)"
      },
      {
        value: "application/font-tdpfr",
        label: "Portable Font Resource (.pfr)"
      },
      {
        value: "application/x-chess-pgn",
        label: "Portable Game Notation (Chess Games) (.pgn)"
      },
      {
        value: "image/x-portable-graymap",
        label: "Portable Graymap Format (.pgm)"
      },
      { value: "image/png", label: "Portable Network Graphics (PNG) (.png)" },
      {
        value: "image/x-citrix-png",
        label: "Portable Network Graphics (PNG) (Citrix client) (.png)"
      },
      {
        value: "image/x-png",
        label: "Portable Network Graphics (PNG) (x-token) (.png)"
      },
      {
        value: "image/x-portable-pixmap",
        label: "Portable Pixmap Format (.ppm)"
      },
      {
        value: "application/pskc+xml",
        label: "Portable Symmetric Key Container (.pskcxml)"
      },
      { value: "application/vnd.ctc-posml", label: "PosML (.pml)" },
      { value: "application/postscript", label: "PostScript (.ai)" },
      { value: "application/x-font-type1", label: "PostScript Fonts (.pfa)" },
      { value: "application/vnd.powerbuilder6", label: "PowerBuilder (.pbd)" },
      {
        value: "application/pgp-encrypted",
        label: "Pretty Good Privacy (.pgp)"
      },
      {
        value: "application/pgp-signature",
        label: "Pretty Good Privacy - Signature (.pgp)"
      },
      {
        value: "application/vnd.previewsystems.box",
        label: "Preview Systems ZipLock/VBox (.box)"
      },
      {
        value: "application/vnd.pvi.ptid1",
        label: "Princeton Video Image (.ptid)"
      },
      {
        value: "application/pls+xml",
        label: "Pronunciation Lexicon Specification (.pls)"
      },
      {
        value: "application/vnd.pg.format",
        label: "Proprietary P&G Standard Reporting System (.str)"
      },
      {
        value: "application/vnd.pg.osasli",
        label: "Proprietary P&G Standard Reporting System (.ei6)"
      },
      { value: "text/prs.lines.tag", label: "PRS Lines Tag (.dsc)" },
      { value: "application/x-font-linux-psf", label: "PSF Fonts (.psf)" },
      {
        value: "application/vnd.publishare-delta-tree",
        label: "PubliShare Objects (.qps)"
      },
      {
        value: "application/vnd.pmi.widget",
        label: "Qualcomm's Plaza Mobile Internet (.wg)"
      },
      {
        value: "application/vnd.quark.quarkxpress",
        label: "QuarkXpress (.qxd)"
      },
      {
        value: "application/vnd.epson.esf",
        label: "QUASS Stream Player (.esf)"
      },
      {
        value: "application/vnd.epson.msf",
        label: "QUASS Stream Player (.msf)"
      },
      {
        value: "application/vnd.epson.ssf",
        label: "QUASS Stream Player (.ssf)"
      },
      {
        value: "application/vnd.epson.quickanime",
        label: "QuickAnime Player (.qam)"
      },
      { value: "application/vnd.intu.qfx", label: "Quicken (.qfx)" },
      { value: "video/quicktime", label: "Quicktime Video (.qt)" },
      { value: "application/x-rar-compressed", label: "RAR Archive (.rar)" },
      { value: "audio/x-pn-realaudio", label: "Real Audio Sound (.ram)" },
      {
        value: "audio/x-pn-realaudio-plugin",
        label: "Real Audio Sound (.rmp)"
      },
      { value: "application/rsd+xml", label: "Really Simple Discovery (.rsd)" },
      { value: "application/vnd.rn-realmedia", label: "RealMedia (.rm)" },
      { value: "application/vnd.realvnc.bed", label: "RealVNC (.bed)" },
      {
        value: "application/vnd.recordare.musicxml",
        label: "Recordare Applications (.mxl)"
      },
      {
        value: "application/vnd.recordare.musicxml+xml",
        label: "Recordare Applications (.musicxml)"
      },
      {
        value: "application/relax-ng-compact-syntax",
        label: "Relax NG Compact Syntax (.rnc)"
      },
      {
        value: "application/vnd.data-vision.rdz",
        label: "RemoteDocs R-Viewer (.rdz)"
      },
      {
        value: "application/rdf+xml",
        label: "Resource Description Framework (.rdf)"
      },
      {
        value: "application/vnd.cloanto.rp9",
        label: "RetroPlatform Player (.rp9)"
      },
      { value: "application/vnd.jisp", label: "RhymBox (.jisp)" },
      { value: "application/rtf", label: "Rich Text Format (.rtf)" },
      { value: "text/richtext", label: "Rich Text Format (RTF) (.rtx)" },
      {
        value: "application/vnd.route66.link66+xml",
        label: "ROUTE 66 Location Based Services (.link66)"
      },
      {
        value: "application/rss+xml",
        label: "RSS - Really Simple Syndication (.rss, .xml)"
      },
      { value: "application/shf+xml", label: "S Hexdump Format (.shf)" },
      {
        value: "application/vnd.sailingtracker.track",
        label: "SailingTracker (.st)"
      },
      {
        value: "image/svg+xml",
        label: "Scalable Vector Graphics (SVG) (.svg)"
      },
      { value: "application/vnd.sus-calendar", label: "ScheduleUs (.sus)" },
      {
        value: "application/sru+xml",
        label: "Search/Retrieve via URL Response Format (.sru)"
      },
      {
        value: "application/set-payment-initiation",
        label: "Secure Electronic Transaction - Payment (.setpay)"
      },
      {
        value: "application/set-registration-initiation",
        label: "Secure Electronic Transaction - Registration (.setreg)"
      },
      { value: "application/vnd.sema", label: "Secured eMail (.sema)" },
      { value: "application/vnd.semd", label: "Secured eMail (.semd)" },
      { value: "application/vnd.semf", label: "Secured eMail (.semf)" },
      { value: "application/vnd.seemail", label: "SeeMail (.see)" },
      { value: "application/x-font-snf", label: "Server Normal Format (.snf)" },
      {
        value: "application/scvp-vp-request",
        label:
          "Server-Based Certificate Validation Protocol - Validation Policies - Request (.spq)"
      },
      {
        value: "application/scvp-vp-response",
        label:
          "Server-Based Certificate Validation Protocol - Validation Policies - Response (.spp)"
      },
      {
        value: "application/scvp-cv-request",
        label:
          "Server-Based Certificate Validation Protocol - Validation Request (.scq)"
      },
      {
        value: "application/scvp-cv-response",
        label:
          "Server-Based Certificate Validation Protocol - Validation Response (.scs)"
      },
      {
        value: "application/sdp",
        label: "Session Description Protocol (.sdp)"
      },
      { value: "text/x-setext", label: "Setext (.etx)" },
      { value: "video/x-sgi-movie", label: "SGI Movie (.movie)" },
      {
        value: "application/vnd.shana.informed.formdata",
        label: "Shana Informed Filler (.ifm)"
      },
      {
        value: "application/vnd.shana.informed.formtemplate",
        label: "Shana Informed Filler (.itp)"
      },
      {
        value: "application/vnd.shana.informed.interchange",
        label: "Shana Informed Filler (.iif)"
      },
      {
        value: "application/vnd.shana.informed.package",
        label: "Shana Informed Filler (.ipk)"
      },
      {
        value: "application/thraud+xml",
        label: "Sharing Transaction Fraud Data (.tfi)"
      },
      { value: "application/x-shar", label: "Shell Archive (.shar)" },
      { value: "image/x-rgb", label: "Silicon Graphics RGB Bitmap (.rgb)" },
      {
        value: "application/vnd.epson.salt",
        label: "SimpleAnimeLite Player (.slt)"
      },
      {
        value: "application/vnd.accpac.simply.aso",
        label: "Simply Accounting (.aso)"
      },
      {
        value: "application/vnd.accpac.simply.imp",
        label: "Simply Accounting - Data Import (.imp)"
      },
      {
        value: "application/vnd.simtech-mindmapper",
        label: "SimTech MindMapper (.twd)"
      },
      {
        value: "application/vnd.commonspace",
        label: "Sixth Floor Media - CommonSpace (.csp)"
      },
      {
        value: "application/vnd.yamaha.smaf-audio",
        label: "SMAF Audio (.saf)"
      },
      { value: "application/vnd.smaf", label: "SMAF File (.mmf)" },
      {
        value: "application/vnd.yamaha.smaf-phrase",
        label: "SMAF Phrase (.spf)"
      },
      {
        value: "application/vnd.smart.teacher",
        label: "SMART Technologies Apps (.teacher)"
      },
      { value: "application/vnd.svd", label: "SourceView Document (.svd)" },
      { value: "application/sparql-query", label: "SPARQL - Query (.rq)" },
      {
        value: "application/sparql-results+xml",
        label: "SPARQL - Results (.srx)"
      },
      {
        value: "application/srgs",
        label: "Speech Recognition Grammar Specification (.gram)"
      },
      {
        value: "application/srgs+xml",
        label: "Speech Recognition Grammar Specification - XML (.grxml)"
      },
      {
        value: "application/ssml+xml",
        label: "Speech Synthesis Markup Language (.ssml)"
      },
      { value: "application/vnd.koan", label: "SSEYO Koan Play File (.skp)" },
      {
        value: "text/sgml",
        label: "Standard Generalized Markup Language (SGML) (.sgml)"
      },
      {
        value: "application/vnd.stardivision.calc",
        label: "StarOffice - Calc (.sdc)"
      },
      {
        value: "application/vnd.stardivision.draw",
        label: "StarOffice - Draw (.sda)"
      },
      {
        value: "application/vnd.stardivision.impress",
        label: "StarOffice - Impress (.sdd)"
      },
      {
        value: "application/vnd.stardivision.math",
        label: "StarOffice - Math (.smf)"
      },
      {
        value: "application/vnd.stardivision.writer",
        label: "StarOffice - Writer (.sdw)"
      },
      {
        value: "application/vnd.stardivision.writer-global",
        label: "StarOffice - Writer (Global) (.sgl)"
      },
      {
        value: "application/vnd.stepmania.stepchart",
        label: "StepMania (.sm)"
      },
      { value: "application/x-stuffit", label: "Stuffit Archive (.sit)" },
      { value: "application/x-stuffitx", label: "Stuffit Archive (.sitx)" },
      {
        value: "application/vnd.solent.sdkm+xml",
        label: "SudokuMagic (.sdkm)"
      },
      {
        value: "application/vnd.olpc-sugar",
        label: "Sugar Linux Application Bundle (.xo)"
      },
      { value: "audio/basic", label: "Sun Audio - Au file format (.au)" },
      { value: "application/vnd.wqd", label: "SundaHus WQ (.wqd)" },
      {
        value: "application/vnd.symbian.install",
        label: "Symbian Install Package (.sis)"
      },
      {
        value: "application/smil+xml",
        label: "Synchronized Multimedia Integration Language (.smi)"
      },
      { value: "application/vnd.syncml+xml", label: "SyncML (.xsm)" },
      {
        value: "application/vnd.syncml.dm+wbxml",
        label: "SyncML - Device Management (.bdm)"
      },
      {
        value: "application/vnd.syncml.dm+xml",
        label: "SyncML - Device Management (.xdm)"
      },
      {
        value: "application/x-sv4cpio",
        label: "System V Release 4 CPIO Archive (.sv4cpio)"
      },
      {
        value: "application/x-sv4crc",
        label: "System V Release 4 CPIO Checksum Data (.sv4crc)"
      },
      {
        value: "application/sbml+xml",
        label: "Systems Biology Markup Language (.sbml)"
      },
      {
        value: "text/tab-separated-values",
        label: "Tab Seperated Values (.tsv)"
      },
      { value: "image/tiff", label: "Tagged Image File Format (.tiff)" },
      {
        value: "application/vnd.tao.intent-module-archive",
        label: "Tao Intent (.tao)"
      },
      { value: "application/x-tar", label: "Tar File (Tape Archive) (.tar)" },
      { value: "application/x-tcl", label: "Tcl Script (.tcl)" },
      { value: "application/x-tex", label: "TeX (.tex)" },
      { value: "application/x-tex-tfm", label: "TeX Font Metric (.tfm)" },
      {
        value: "application/tei+xml",
        label: "Text Encoding and Interchange (.tei)"
      },
      { value: "text/plain", label: "Text File (.txt)" },
      { value: "application/vnd.spotfire.dxp", label: "TIBCO Spotfire (.dxp)" },
      { value: "application/vnd.spotfire.sfs", label: "TIBCO Spotfire (.sfs)" },
      {
        value: "application/timestamped-data",
        label: "Time Stamped Data Envelope (.tsd)"
      },
      { value: "application/vnd.trid.tpt", label: "TRI Systems Config (.tpt)" },
      {
        value: "application/vnd.triscape.mxs",
        label: "Triscape Map Explorer (.mxs)"
      },
      { value: "text/troff", label: "troff (.t)" },
      { value: "application/vnd.trueapp", label: "True BASIC (.tra)" },
      { value: "application/x-font-ttf", label: "TrueType Font (.ttf)" },
      {
        value: "text/turtle",
        label: "Turtle (Terse RDF Triple Language) (.ttl)"
      },
      { value: "application/vnd.umajin", label: "UMAJIN (.umj)" },
      {
        value: "application/vnd.uoml+xml",
        label: "Unique Object Markup Language (.uoml)"
      },
      { value: "application/vnd.unity", label: "Unity 3d (.unityweb)" },
      {
        value: "application/vnd.ufdl",
        label: "Universal Forms Description Language (.ufd)"
      },
      { value: "text/uri-list", label: "URI Resolution Services (.uri)" },
      {
        value: "application/vnd.uiq.theme",
        label: "User Interface Quartz - Theme (Symbian) (.utz)"
      },
      {
        value: "application/x-ustar",
        label: "Ustar (Uniform Standard Tape Archive) (.ustar)"
      },
      { value: "text/x-uuencode", label: "UUEncode (.uu)" },
      { value: "text/x-vcalendar", label: "vCalendar (.vcs)" },
      { value: "text/x-vcard", label: "vCard (.vcf)" },
      { value: "application/x-cdlink", label: "Video CD (.vcd)" },
      { value: "application/vnd.vsf", label: "Viewport+ (.vsf)" },
      {
        value: "model/vrml",
        label: "Virtual Reality Modeling Language (.wrl)"
      },
      { value: "application/vnd.vcx", label: "VirtualCatalog (.vcx)" },
      { value: "model/vnd.mts", label: "Virtue MTS (.mts)" },
      { value: "model/vnd.vtu", label: "Virtue VTU (.vtu)" },
      { value: "application/vnd.visionary", label: "Visionary (.vis)" },
      { value: "video/vnd.vivo", label: "Vivo (.viv)" },
      {
        value: "application/ccxml+xml,",
        label: "Voice Browser Call Control (.ccxml)"
      },
      { value: "application/voicexml+xml", label: "VoiceXML (.vxml)" },
      { value: "application/x-wais-source", label: "WAIS Source (.src)" },
      {
        value: "application/vnd.wap.wbxml",
        label: "WAP Binary XML (WBXML) (.wbxml)"
      },
      { value: "image/vnd.wap.wbmp", label: "WAP Bitamp (WBMP) (.wbmp)" },
      {
        value: "audio/x-wav",
        label: "Waveform Audio File Format (WAV) (.wav)"
      },
      {
        value: "application/davmount+xml",
        label: "Web Distributed Authoring and Versioning (.davmount)"
      },
      {
        value: "application/x-font-woff",
        label: "Web Open Font Format (.woff)"
      },
      {
        value: "application/wspolicy+xml",
        label: "Web Services Policy (.wspolicy)"
      },
      { value: "image/webp", label: "WebP Image (.webp)" },
      { value: "application/vnd.webturbo", label: "WebTurbo (.wtb)" },
      {
        value: "application/widget",
        label: "Widget Packaging and XML Configuration (.wgt)"
      },
      { value: "application/winhlp", label: "WinHelp (.hlp)" },
      {
        value: "text/vnd.wap.wml",
        label: "Wireless Markup Language (WML) (.wml)"
      },
      {
        value: "text/vnd.wap.wmlscript",
        label: "Wireless Markup Language Script (WMLScript) (.wmls)"
      },
      { value: "application/vnd.wap.wmlscriptc", label: "WMLScript (.wmlsc)" },
      { value: "application/vnd.wordperfect", label: "Wordperfect (.wpd)" },
      { value: "application/vnd.wt.stf", label: "Worldtalk (.stf)" },
      {
        value: "application/wsdl+xml",
        label: "WSDL - Web Services Description Language (.wsdl)"
      },
      { value: "image/x-xbitmap", label: "X BitMap (.xbm)" },
      { value: "image/x-xpixmap", label: "X PixMap (.xpm)" },
      { value: "image/x-xwindowdump", label: "X Window Dump (.xwd)" },
      {
        value: "application/x-x509-ca-cert",
        label: "X.509 Certificate (.der)"
      },
      { value: "application/x-xfig", label: "Xfig (.fig)" },
      {
        value: "application/xhtml+xml",
        label: "XHTML - The Extensible HyperText Markup Language (.xhtml)"
      },
      {
        value: "application/xml",
        label: "XML - Extensible Markup Language (.xml)"
      },
      {
        value: "application/xcap-diff+xml",
        label: "XML Configuration Access Protocol - XCAP Diff (.xdf)"
      },
      {
        value: "application/xenc+xml",
        label: "XML Encryption Syntax and Processing (.xenc)"
      },
      {
        value: "application/patch-ops-error+xml",
        label: "XML Patch Framework (.xer)"
      },
      {
        value: "application/resource-lists+xml",
        label: "XML Resource Lists (.rl)"
      },
      {
        value: "application/rls-services+xml",
        label: "XML Resource Lists (.rs)"
      },
      {
        value: "application/resource-lists-diff+xml",
        label: "XML Resource Lists Diff (.rld)"
      },
      { value: "application/xslt+xml", label: "XML Transformations (.xslt)" },
      {
        value: "application/xop+xml",
        label: "XML-Binary Optimized Packaging (.xop)"
      },
      { value: "application/x-xpinstall", label: "XPInstall - Mozilla (.xpi)" },
      {
        value: "application/xspf+xml",
        label: "XSPF - XML Shareable Playlist Format (.xspf)"
      },
      {
        value: "application/vnd.mozilla.xul+xml",
        label: "XUL - XML User Interface Language (.xul)"
      },
      { value: "chemical/x-xyz", label: "XYZ File Format (.xyz)" },
      {
        value: "text/yaml",
        label:
          "YAML Ain't Markup Language / Yet Another Markup Language (.yaml)"
      },
      {
        value: "application/yang",
        label: "YANG Data Modeling Language (.yang)"
      },
      { value: "application/yin+xml", label: "YIN (YANG - XML) (.yin)" },
      { value: "application/vnd.zul", label: "Z.U.L. Geometry (.zir)" },
      { value: "application/zip", label: "Zip Archive (.zip)" },
      {
        value: "application/vnd.handheld-entertainment+xml",
        label: "ZVUE Media Manager (.zmm)"
      },
      { value: "application/vnd.zzazz.deck+xml", label: "Zzazz Deck (.zaz)" }
    ]
  },
  landingPage: {
    mandatory: false,
    validators: [
      {
        fn: global_validators.validUrl,
        args: {}
      }
    ]
  },
  references: {
    mandatory: false,
    validators: [
      {
        fn: global_validators.validUrl,
        args: {}
      }
    ]
  },
  distribution: {
    mandatory: false,
    validators: [
      {
        fn: global_validators.passThruValidation,
        args: {}
      }
    ]
  }
};
