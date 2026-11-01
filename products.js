/* LabSupply — the product catalogue.
   Every page reads this list, so prices and names only live in one place. */

window.PRODUCTS = [
  {
    id: "1",
    name: "BPC-157",
    category: "Research compounds",
    size: "10 mg",
    price: 65,
    image: "images/vial-01.webp",
    blurb:
      "A 15-amino-acid synthetic peptide supplied as a sterile-filtered lyophilised powder. Each lot is tested for purity and identity before release.",
    specs: {
      Purity: "≥ 99.0% (HPLC-UV)",
      Identity: "Confirmed by LC-MS",
      Form: "Lyophilised powder",
      Storage: "-20 °C, protected from light",
      Documentation: "Batch COA and SDS included"
    }
  },
  {
    id: "2",
    name: "TB-500",
    category: "Research compounds",
    size: "10 mg",
    price: 85,
    image: "images/vial-02.webp",
    blurb:
      "Thymosin beta-4 fragment for in vitro work, presented as a lyophilised powder in a sealed vial with a batch-matched certificate of analysis.",
    specs: {
      Purity: "≥ 99.0% (HPLC-UV)",
      Identity: "Confirmed by LC-MS",
      Form: "Lyophilised powder",
      Storage: "-20 °C, protected from light",
      Documentation: "Batch COA and SDS included"
    }
  },
  {
    id: "3",
    name: "MOTS-c",
    category: "Research compounds",
    size: "10 mg",
    price: 65,
    image: "images/vial-03.webp",
    blurb:
      "Mitochondrial-derived peptide supplied for laboratory investigation, with endotoxin and heavy-metal screening recorded on the batch file.",
    specs: {
      Purity: "≥ 99.0% (HPLC-UV)",
      Identity: "Confirmed by LC-MS",
      Endotoxins: "< 5 EU/mg (USP <85>)",
      Storage: "-20 °C, protected from light",
      Documentation: "Batch COA and SDS included"
    }
  },
  {
    id: "4",
    name: "GHK-Cu",
    category: "Copper compounds",
    size: "100 mg",
    price: 55,
    image: "images/vial-04.webp",
    blurb:
      "Copper tripeptide complex, deep blue in solution, supplied as a lyophilised powder for in vitro studies. Heavy metals are screened by ICP-MS.",
    specs: {
      Purity: "≥ 98.5% (HPLC-UV)",
      Identity: "Confirmed by LC-MS",
      "Heavy metals": "Screened by ICP-MS",
      Storage: "-20 °C, protected from light",
      Documentation: "Batch COA and SDS included"
    }
  },
  {
    id: "5",
    name: "Tesamorelin",
    category: "Research compounds",
    size: "10 mg",
    price: 70,
    image: "images/vial-05.webp",
    blurb:
      "Recombinant-growth-hormone-releasing factor analogue supplied for laboratory research only, with a lot-specific COA in every box.",
    specs: {
      Purity: "≥ 99.0% (HPLC-UV)",
      Identity: "Confirmed by LC-MS",
      Form: "Lyophilised powder",
      Storage: "-20 °C, protected from light",
      Documentation: "Batch COA and SDS included"
    }
  },
  {
    id: "6",
    name: "Ipamorelin",
    category: "Research compounds",
    size: "10 mg",
    price: 60,
    image: "images/vial-01.webp",
    blurb:
      "Pentapeptide supplied as a lyophilised powder. Purity, identity and net peptide content are listed on the certificate of analysis.",
    specs: {
      Purity: "≥ 99.0% (HPLC-UV)",
      Identity: "Confirmed by LC-MS",
      "Net content": "Reported per batch",
      Storage: "-20 °C, protected from light",
      Documentation: "Batch COA and SDS included"
    }
  },
  {
    id: "7",
    name: "CJC-1295 (no DAC)",
    category: "Research compounds",
    size: "10 mg",
    price: 70,
    image: "images/vial-02.webp",
    blurb:
      "Modified growth-hormone-releasing hormone for in vitro work. Supplied in a sealed vial with a documented batch record.",
    specs: {
      Purity: "≥ 99.0% (HPLC-UV)",
      Identity: "Confirmed by LC-MS",
      Form: "Lyophilised powder",
      Storage: "-20 °C, protected from light",
      Documentation: "Batch COA and SDS included"
    }
  },
  {
    id: "8",
    name: "BPC-157 / TB-500 Blend",
    category: "Blends",
    size: "10 / 10 mg",
    price: 145,
    image: "images/vial-03.webp",
    blurb:
      "A pre-mixed research blend supplied in a single vial. Each component is verified separately and reported on the same certificate of analysis.",
    specs: {
      Purity: "≥ 99.0% per component (HPLC-UV)",
      Identity: "Confirmed by LC-MS",
      Form: "Lyophilised powder",
      Storage: "-20 °C, protected from light",
      Documentation: "Blended batch COA and SDS"
    }
  },
  {
    id: "9",
    name: "Klow Blend",
    category: "Blends",
    size: "50 / 10 / 10 / 10 mg",
    price: 175,
    image: "images/vial-04.webp",
    blurb:
      "Four-component research blend (GHK-Cu, KPV, BPC-157, TB-500). Supplied in a single sealed vial with the full blend record.",
    specs: {
      Purity: "≥ 98.5% per component (HPLC-UV)",
      Identity: "Confirmed by LC-MS",
      Form: "Lyophilised powder",
      Storage: "-20 °C, protected from light",
      Documentation: "Blended batch COA and SDS"
    }
  },
  {
    id: "10",
    name: "Melanotan II",
    category: "Research compounds",
    size: "10 mg",
    price: 60,
    image: "images/vial-05.webp",
    blurb:
      "Synthetic peptide analogue for laboratory research, tested for purity and molecular identity before release.",
    specs: {
      Purity: "≥ 99.0% (HPLC-UV)",
      Identity: "Confirmed by LC-MS",
      Form: "Lyophilised powder",
      Storage: "-20 °C, protected from light",
      Documentation: "Batch COA and SDS included"
    }
  },
  {
    id: "11",
    name: "NAD+",
    category: "Cofactors & coenzymes",
    size: "100 mg",
    price: 75,
    image: "images/vial-01.webp",
    blurb:
      "Nicotinamide adenine dinucleotide supplied as a lyophilised powder for in vitro experiments, with purity reported per batch.",
    specs: {
      Purity: "≥ 98.0% (HPLC-UV)",
      Identity: "Confirmed by LC-MS",
      Form: "Lyophilised powder",
      Storage: "-20 °C, protected from light",
      Documentation: "Batch COA and SDS included"
    }
  },
  {
    id: "12",
    name: "Glass Sample Vials",
    category: "Laboratory supplies",
    size: "10 mL · pack of 50",
    price: 18,
    image: "images/vial-02.webp",
    blurb:
      "Clear borosilicate sample vials with screw caps for storing and transporting laboratory samples. Supplied clean and ready for labelling.",
    specs: {
      Material: "Borosilicate glass, 3.3",
      Volume: "10 mL",
      Closure: "Screw cap with PTFE liner",
      Pack: "50 vials",
      Documentation: "Materials certificate included"
    }
  }
];

/* Batch records: one certificate of analysis per lot.
   Demo data — replace with real laboratory results before launch. */
window.PRODUCTS.forEach(function (product, index) {
  product.batch = {
    coa: String(2610200100 + (index + 1) * 7),
    lot: "PH-L" + String(product.id).padStart(3, "0") + "-04" + String(8 + index),
    reported: "10/21/2026",
    purity: (98.7 + (index % 5) * 0.28).toFixed(2)
  };
});
