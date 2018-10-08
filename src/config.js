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
      //console.log(obj);
      val = obj.find(item => item.validations);
      if (val) val = val.validations;
    }
    //console.log(val);
    return val ? val : "";
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
    mandatory: true,
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
    mandatory: true,
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
