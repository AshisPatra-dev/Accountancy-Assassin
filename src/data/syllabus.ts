// ============================================================
// ACCOUNTANCY ASSASSIN — Official WBCHSE Syllabus Metadata
// Complete catalog of Semesters 1 to 4, Units, and Topics.
// All Bengali titles marked needsReview: true for WBCHSE teacher review.
// ============================================================

export interface TopicMeta {
  id: string;          // e.g. "S1-U1-T01"
  semId: 1 | 2 | 3 | 4;
  unitId: string;      // "U1", "U2", "U3", "U3A", "U3B", "U4"
  order: number;       // within unit — unlock in this order
  title: string;       // English title from syllabus
  titleBn: string;     // Bengali title (needsReview:true, mark with comment)
  type: 'T' | 'N' | 'M'; // Theory / Numerical / Mixed
  lessonCount: number; // T=10-14, N=18-24, M=14-20
  priorityClass: 'A' | 'B' | 'C'; // from Sem 1 priority; 'A' for all Sem 2-4
  markWeight: number;  // this topic's share of the unit's SRP (computed)
}

export interface UnitMeta {
  id: string;         // "U1", "U3A", "U3B"
  semId: 1 | 2 | 3 | 4;
  title: string;
  titleBn: string;
  marks: number;
  hours: number;
  topics: TopicMeta[];
  trackRequired?: 'analysis' | 'computer'; // for U3A and U3B
}

export interface SemesterMeta {
  id: 1 | 2 | 3 | 4;
  title: string;
  totalMarks: number;
  examFormat: 'mcq' | 'written';
  units: UnitMeta[];
}

export const SYLLABUS: Record<1 | 2 | 3 | 4, SemesterMeta> = {
  1: {
  "id": 1,
  "title": "Semester 1: Fundamentals of Accounting",
  "totalMarks": 40,
  "examFormat": "mcq",
  "units": [
    {
      "id": "U1",
      "semId": 1,
      "title": "Introduction and Theory Base of Accounting",
      "titleBn": "হিসাবশাস্ত্রের ভূমিকা ও তাত্ত্বিক ভিত্তি",
      "marks": 12,
      "hours": 30,
      "topics": [
        {
          "id": "S1-U1-T01",
          "semId": 1,
          "unitId": "U1",
          "order": 1,
          "title": "Meaning, objectives and limitations of accounting",
          "titleBn": "হিসাবশাস্ত্রের অর্থ, উদ্দেশ্য ও সীমাবদ্ধতা",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "B",
          "markWeight": 0.71
        },
        {
          "id": "S1-U1-T02",
          "semId": 1,
          "unitId": "U1",
          "order": 2,
          "title": "Users of accounting information and their needs",
          "titleBn": "হিসাব তথ্যের ব্যবহারকারী ও তাদের প্রয়োজনীয়তা",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "B",
          "markWeight": 0.71
        },
        {
          "id": "S1-U1-T03",
          "semId": 1,
          "unitId": "U1",
          "order": 3,
          "title": "Sub-fields of accounting",
          "titleBn": "হিসাবশাস্ত্রের শাখা বা উপক্ষেত্র",
          "type": "T",
          "lessonCount": 10,
          "priorityClass": "B",
          "markWeight": 0.71
        },
        {
          "id": "S1-U1-T04",
          "semId": 1,
          "unitId": "U1",
          "order": 4,
          "title": "Basic terms I",
          "titleBn": "মৌলিক পারিভাষিক শব্দ ১: সত্তা, লেনদেন, মূলধন, উত্তোলন",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "B",
          "markWeight": 0.71
        },
        {
          "id": "S1-U1-T05",
          "semId": 1,
          "unitId": "U1",
          "order": 5,
          "title": "Basic terms II",
          "titleBn": "মৌলিক পারিভাষিক শব্দ ২: সম্পদ ও দায়",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "B",
          "markWeight": 0.71
        },
        {
          "id": "S1-U1-T06",
          "semId": 1,
          "unitId": "U1",
          "order": 6,
          "title": "Basic terms III",
          "titleBn": "মৌলিক পারিভাষিক শব্দ ৩: খরচ, রাজস্ব, আয়, লাভ ও ক্ষতি",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "B",
          "markWeight": 0.71
        },
        {
          "id": "S1-U1-T07",
          "semId": 1,
          "unitId": "U1",
          "order": 7,
          "title": "Basic terms IV",
          "titleBn": "মৌলিক পারিভাষিক শব্দ ৪: ক্রয়, বিক্রয়, পণ্য, মজুত, দেনাদার, পাওনাদার ও ভাউচার",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "B",
          "markWeight": 0.71
        },
        {
          "id": "S1-U1-T08",
          "semId": 1,
          "unitId": "U1",
          "order": 8,
          "title": "Discount, contingent assets and contingent liabilities",
          "titleBn": "বাট্টা, সম্ভাব্য সম্পদ ও সম্ভাব্য দায়",
          "type": "T",
          "lessonCount": 10,
          "priorityClass": "C",
          "markWeight": 0.71
        },
        {
          "id": "S1-U1-T09",
          "semId": 1,
          "unitId": "U1",
          "order": 9,
          "title": "Receipts, expenditure and deferred revenue expenditure",
          "titleBn": "প্রাপ্তি, ব্যয় ও বিলম্বিত রাজস্ব জাতীয় ব্যয়",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 0.71
        },
        {
          "id": "S1-U1-T10",
          "semId": 1,
          "unitId": "U1",
          "order": 10,
          "title": "GAAP",
          "titleBn": "সর্বজনগ্রাহ্য হিসাববিজ্ঞান নীতি (GAAP)",
          "type": "T",
          "lessonCount": 10,
          "priorityClass": "B",
          "markWeight": 0.71
        },
        {
          "id": "S1-U1-T11",
          "semId": 1,
          "unitId": "U1",
          "order": 11,
          "title": "Accounting concepts I",
          "titleBn": "হিসাব ধারণা ১: ব্যবসায় সত্তা, অর্থ পরিমাপ, চলমান প্রতিষ্ঠান, হিসাবকাল, ব্যয়",
          "type": "T",
          "lessonCount": 14,
          "priorityClass": "A",
          "markWeight": 0.71
        },
        {
          "id": "S1-U1-T12",
          "semId": 1,
          "unitId": "U1",
          "order": 12,
          "title": "Accounting concepts II",
          "titleBn": "হিসাব ধারণা ২: দ্বৈত সত্তা, রাজস্ব স্বীকৃতি, মিলকরণ, পূর্ণ প্রকাশ",
          "type": "T",
          "lessonCount": 14,
          "priorityClass": "A",
          "markWeight": 0.71
        },
        {
          "id": "S1-U1-T13",
          "semId": 1,
          "unitId": "U1",
          "order": 13,
          "title": "Accounting concepts III",
          "titleBn": "হিসাব ধারণা ৩: ধারাবাহিকতা, রক্ষণশীলতা, বস্তুনিষ্ঠতা, নিরপেক্ষতা",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 0.71
        },
        {
          "id": "S1-U1-T14",
          "semId": 1,
          "unitId": "U1",
          "order": 14,
          "title": "Systems and bases of accounting",
          "titleBn": "হিসাব পদ্ধতি ও হিসাবের ভিত্তি: একক বনাম দু'তরফা, নগদ বনাম বকেয়া ভিত্তি",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "B",
          "markWeight": 0.71
        },
        {
          "id": "S1-U1-T15",
          "semId": 1,
          "unitId": "U1",
          "order": 15,
          "title": "Valuation principles",
          "titleBn": "মূল্যায়ন নীতিসমূহ: ঐতিহাসিক ব্যয়, চলতি ব্যয়, আদায়যোগ্য মূল্য ও বর্তমান মূল্য",
          "type": "T",
          "lessonCount": 10,
          "priorityClass": "B",
          "markWeight": 0.71
        },
        {
          "id": "S1-U1-T16",
          "semId": 1,
          "unitId": "U1",
          "order": 16,
          "title": "Accounting standards",
          "titleBn": "হিসাব মানক: AS এর উদ্দেশ্য, Ind AS ও এর প্রয়োগযোগ্যতা",
          "type": "T",
          "lessonCount": 10,
          "priorityClass": "B",
          "markWeight": 0.71
        },
        {
          "id": "S1-U1-T17",
          "semId": 1,
          "unitId": "U1",
          "order": 17,
          "title": "Goods and Services Tax",
          "titleBn": "পণ্য ও পরিষেবা কর (GST): বৈশিষ্ট্য ও সুবিধাসমূহ",
          "type": "T",
          "lessonCount": 10,
          "priorityClass": "B",
          "markWeight": 0.71
        }
      ]
    },
    {
      "id": "U2",
      "semId": 1,
      "title": "Fundamental Accounting Process I",
      "titleBn": "মৌলিক হিসাবরক্ষণ প্রক্রিয়া ১",
      "marks": 16,
      "hours": 40,
      "topics": [
        {
          "id": "S1-U2-T01",
          "semId": 1,
          "unitId": "U2",
          "order": 1,
          "title": "Source documents and vouchers",
          "titleBn": "উৎস দলিল ও ভাউচার",
          "type": "M",
          "lessonCount": 14,
          "priorityClass": "C",
          "markWeight": 1.07
        },
        {
          "id": "S1-U2-T02",
          "semId": 1,
          "unitId": "U2",
          "order": 2,
          "title": "Fundamental accounting equation: meaning",
          "titleBn": "মৌলিক হিসাব সমীকরণ: অর্থ ও ধারণা",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1.07
        },
        {
          "id": "S1-U2-T03",
          "semId": 1,
          "unitId": "U2",
          "order": 3,
          "title": "Accounting equation: analysing transactions",
          "titleBn": "হিসাব সমীকরণ: লেনদেনের বিশ্লেষণ",
          "type": "N",
          "lessonCount": 22,
          "priorityClass": "A",
          "markWeight": 1.07
        },
        {
          "id": "S1-U2-T04",
          "semId": 1,
          "unitId": "U2",
          "order": 4,
          "title": "Classification of accounts and traditional rules",
          "titleBn": "হিসাবের শ্রেণীবিন্যাস ও সনাতন গোল্ডেন রুলস",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 1.07
        },
        {
          "id": "S1-U2-T05",
          "semId": 1,
          "unitId": "U2",
          "order": 5,
          "title": "Modern rules of debit and credit",
          "titleBn": "ডেবিট ও ক্রেডিটের আধুনিক নিয়ম",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 1.07
        },
        {
          "id": "S1-U2-T06",
          "semId": 1,
          "unitId": "U2",
          "order": 6,
          "title": "The Journal",
          "titleBn": "জাবেদা: অর্থ, ছক, বিবরণ ও সাধারণ জাবেদা দাখিলা",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1.07
        },
        {
          "id": "S1-U2-T07",
          "semId": 1,
          "unitId": "U2",
          "order": 7,
          "title": "Compound entries and credit transactions",
          "titleBn": "যৌগিক জাবেদা ও বাকিতে লেনদেন",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1.07
        },
        {
          "id": "S1-U2-T08",
          "semId": 1,
          "unitId": "U2",
          "order": 8,
          "title": "Entries for goods, fixed assets and discounts",
          "titleBn": "পণ্য, স্থায়ী সম্পদ ও বাট্টার দাখিলা",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1.07
        },
        {
          "id": "S1-U2-T09",
          "semId": 1,
          "unitId": "U2",
          "order": 9,
          "title": "Purchases Book",
          "titleBn": "ক্রয় বহি: ধারণা, ছক ও লিপিবদ্ধকরণ",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1.07
        },
        {
          "id": "S1-U2-T10",
          "semId": 1,
          "unitId": "U2",
          "order": 10,
          "title": "Sales Book",
          "titleBn": "বিক্রয় বহি: ধারণা, ছক ও লিপিবদ্ধকরণ",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1.07
        },
        {
          "id": "S1-U2-T11",
          "semId": 1,
          "unitId": "U2",
          "order": 11,
          "title": "Purchases Return Book",
          "titleBn": "ক্রয় ফেরত বহি ও ডেবিট নোট",
          "type": "N",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 1.07
        },
        {
          "id": "S1-U2-T12",
          "semId": 1,
          "unitId": "U2",
          "order": 12,
          "title": "Sales Return Book",
          "titleBn": "বিক্রয় ফেরত বহি ও ক্রেডিট নোট",
          "type": "N",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 1.07
        },
        {
          "id": "S1-U2-T13",
          "semId": 1,
          "unitId": "U2",
          "order": 13,
          "title": "Journal Proper",
          "titleBn": "প্রকৃত জাবেদা: প্রারম্ভিক, সমন্বয় ও সংশোধনী দাখিলা",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 1.07
        },
        {
          "id": "S1-U2-T14",
          "semId": 1,
          "unitId": "U2",
          "order": 14,
          "title": "Classification of errors",
          "titleBn": "ভুলের শ্রেণীবিন্যাস: বাদ পড়া, লেখার ভুল, নীতিগত ও পরিপূরক ভুল",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 1.07
        },
        {
          "id": "S1-U2-T15",
          "semId": 1,
          "unitId": "U2",
          "order": 15,
          "title": "Detection and rectification of errors",
          "titleBn": "রেওয়ামিল পূর্ববর্তী ভুল শনাক্তকরণ ও সংশোধনী দাখিলা",
          "type": "N",
          "lessonCount": 22,
          "priorityClass": "A",
          "markWeight": 1.07
        }
      ]
    },
    {
      "id": "U3",
      "semId": 1,
      "title": "Reserves and Provisions",
      "titleBn": "সঞ্চিতি ও সংস্থান",
      "marks": 6,
      "hours": 15,
      "topics": [
        {
          "id": "S1-U3-T01",
          "semId": 1,
          "unitId": "U3",
          "order": 1,
          "title": "Provisions and reserves: meaning",
          "titleBn": "সঞ্চিতি ও সংস্থানের অর্থ ও উদ্দেশ্য",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 1.5
        },
        {
          "id": "S1-U3-T02",
          "semId": 1,
          "unitId": "U3",
          "order": 2,
          "title": "Difference between provisions and reserves",
          "titleBn": "সঞ্চিতি ও সংস্থানের মধ্যে পার্থক্য",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 1.5
        },
        {
          "id": "S1-U3-T03",
          "semId": 1,
          "unitId": "U3",
          "order": 3,
          "title": "Types of reserves",
          "titleBn": "সঞ্চিতির বিভিন্ন প্রকারভেদ",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "B",
          "markWeight": 1.5
        },
        {
          "id": "S1-U3-T04",
          "semId": 1,
          "unitId": "U3",
          "order": 4,
          "title": "Capital reserve vs revenue reserve",
          "titleBn": "মূলধন সঞ্চিতি বনাম রাজস্ব সঞ্চিতি",
          "type": "M",
          "lessonCount": 14,
          "priorityClass": "A",
          "markWeight": 1.5
        }
      ]
    },
    {
      "id": "U4",
      "semId": 1,
      "title": "Bills of Exchange",
      "titleBn": "বাণিজ্যিক হুন্ডি বা বিল অব এক্সচেঞ্জ",
      "marks": 6,
      "hours": 15,
      "topics": [
        {
          "id": "S1-U4-T01",
          "semId": 1,
          "unitId": "U4",
          "order": 1,
          "title": "Bill of exchange and promissory note",
          "titleBn": "বিল অব এক্সচেঞ্জ ও প্রতিজ্ঞাপত্র: বৈশিষ্ট্য, পক্ষসমূহ ও পার্থক্য",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 0.75
        },
        {
          "id": "S1-U4-T02",
          "semId": 1,
          "unitId": "U4",
          "order": 2,
          "title": "Important terms I",
          "titleBn": "গুরুত্বপূর্ণ পরিভাষা ১: মেয়াদ, দেয় তারিখ, অনুকম্পা দিন ও মেয়াদপূর্তির তারিখ",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 0.75
        },
        {
          "id": "S1-U4-T03",
          "semId": 1,
          "unitId": "U4",
          "order": 3,
          "title": "Important terms II",
          "titleBn": "গুরুত্বপূর্ণ পরিভাষা ২: বাট্টাকরণ, পৃষ্ঠ্যাঙ্কন, আদায়ার্থে প্রেরণ, প্রত্যাখ্যান ও নোটিং",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "B",
          "markWeight": 0.75
        },
        {
          "id": "S1-U4-T04",
          "semId": 1,
          "unitId": "U4",
          "order": 4,
          "title": "Accounting for a bill held till maturity",
          "titleBn": "মেয়াদপূর্তি পর্যন্ত রক্ষিত বিলের হিসাবরক্ষণ",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 0.75
        },
        {
          "id": "S1-U4-T05",
          "semId": 1,
          "unitId": "U4",
          "order": 5,
          "title": "Accounting for a discounted bill",
          "titleBn": "বাট্টাকৃত বিলের হিসাবরক্ষণ দাখিলা",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "B",
          "markWeight": 0.75
        },
        {
          "id": "S1-U4-T06",
          "semId": 1,
          "unitId": "U4",
          "order": 6,
          "title": "Endorsement and collection",
          "titleBn": "বিলের পৃষ্ঠ্যাঙ্কন ও ব্যাংকে আদায়ার্থে প্রেরণ",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "B",
          "markWeight": 0.75
        },
        {
          "id": "S1-U4-T07",
          "semId": 1,
          "unitId": "U4",
          "order": 7,
          "title": "Dishonour and noting charges",
          "titleBn": "বিলের প্রত্যাখ্যান ও নোটিং খরচের হিসাব",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 0.75
        },
        {
          "id": "S1-U4-T08",
          "semId": 1,
          "unitId": "U4",
          "order": 8,
          "title": "Integrated bill problems",
          "titleBn": "বিল সংক্রান্ত সমন্বিত গাণিতিক সমস্যা",
          "type": "N",
          "lessonCount": 22,
          "priorityClass": "A",
          "markWeight": 0.75
        }
      ]
    }
  ]
},
  2: {
  "id": 2,
  "title": "Semester 2: Partnership & Special Accounts",
  "totalMarks": 40,
  "examFormat": "written",
  "units": [
    {
      "id": "U1",
      "semId": 2,
      "title": "Fundamental Accounting Process II",
      "titleBn": "মৌলিক হিসাবরক্ষণ প্রক্রিয়া ২",
      "marks": 20,
      "hours": 40,
      "topics": [
        {
          "id": "S2-U1-T01",
          "semId": 2,
          "unitId": "U1",
          "order": 1,
          "title": "Ledger: meaning and format",
          "titleBn": "খতিয়ান: অর্থ, ছক ও স্বাভাবিক জের",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T02",
          "semId": 2,
          "unitId": "U1",
          "order": 2,
          "title": "Posting from the journal",
          "titleBn": "জাবেদা থেকে খতিয়ানে স্থানান্তরকরণ",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T03",
          "semId": 2,
          "unitId": "U1",
          "order": 3,
          "title": "Posting from subsidiary books",
          "titleBn": "সহায়ক বহি থেকে খতিয়ানে পোস্টিং",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T04",
          "semId": 2,
          "unitId": "U1",
          "order": 4,
          "title": "Balancing of accounts",
          "titleBn": "হিসাবের জের বা ব্যালেন্স টানা (c/d ও b/d)",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T05",
          "semId": 2,
          "unitId": "U1",
          "order": 5,
          "title": "Simple cash book",
          "titleBn": "একঘরা নগদান বই",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T06",
          "semId": 2,
          "unitId": "U1",
          "order": 6,
          "title": "Cash book with cash and bank columns",
          "titleBn": "নগদ ও ব্যাংক ঘরবিশিষ্ট দু'ঘরা নগদান বই ও কন্ট্রা দাখিলা",
          "type": "N",
          "lessonCount": 22,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T07",
          "semId": 2,
          "unitId": "U1",
          "order": 7,
          "title": "Petty cash book",
          "titleBn": "খুচরা নগদান বই ও অগ্রদত্ত পদ্ধতি (Imprest System)",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T08",
          "semId": 2,
          "unitId": "U1",
          "order": 8,
          "title": "Trial balance: meaning, objectives and limitations",
          "titleBn": "রেওয়ামিল: অর্থ, উদ্দেশ্য ও সীমাবদ্ধতা",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T09",
          "semId": 2,
          "unitId": "U1",
          "order": 9,
          "title": "Preparing a trial balance from balances",
          "titleBn": "জের থেকে রেওয়ামিল প্রস্তুতকরণ",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T10",
          "semId": 2,
          "unitId": "U1",
          "order": 10,
          "title": "Bank reconciliation: need and causes",
          "titleBn": "ব্যাংক সমন্বয় বিবরণী: প্রয়োজনীয়তা ও পার্থক্যের কারণসমূহ",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T11",
          "semId": 2,
          "unitId": "U1",
          "order": 11,
          "title": "BRS starting from the cash book balance",
          "titleBn": "নগদান বইয়ের জের নিয়ে ব্যাংক সমন্বয় প্রস্তুতকরণ",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T12",
          "semId": 2,
          "unitId": "U1",
          "order": 12,
          "title": "BRS starting from the pass book balance",
          "titleBn": "পাস বইয়ের জের নিয়ে ব্যাংক সমন্বয় বিবরণী",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T13",
          "semId": 2,
          "unitId": "U1",
          "order": 13,
          "title": "Rectification after the trial balance",
          "titleBn": "রেওয়ামিল প্রস্তুতের পরবর্তী ভুল সংশোধন",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T14",
          "semId": 2,
          "unitId": "U1",
          "order": 14,
          "title": "Suspense account",
          "titleBn": "অনিশ্চিত হিসাব: খোলা, দাখিলা ও বন্ধকরণ",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T15",
          "semId": 2,
          "unitId": "U1",
          "order": 15,
          "title": "Depreciation: meaning, need and factors",
          "titleBn": "অবচয়: অর্থ, প্রয়োজনীয়তা ও নির্ধারক উপাদানসমূহ",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T16",
          "semId": 2,
          "unitId": "U1",
          "order": 16,
          "title": "Straight Line Method",
          "titleBn": "সরলরৈখিক অবচয় পদ্ধতি (SLM)",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T17",
          "semId": 2,
          "unitId": "U1",
          "order": 17,
          "title": "Written Down Value Method",
          "titleBn": "ক্রমহ্রাসমান জের পদ্ধতি (WDV)",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T18",
          "semId": 2,
          "unitId": "U1",
          "order": 18,
          "title": "SLM vs WDV",
          "titleBn": "সরলরৈখিক বনাম ক্রমহ্রাসমান জের পদ্ধতির তুলনা",
          "type": "M",
          "lessonCount": 14,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T19",
          "semId": 2,
          "unitId": "U1",
          "order": 19,
          "title": "Recording depreciation: charging to the asset account",
          "titleBn": "সম্পদ হিসাবে সরাসরি অবচয় ধার্যের হিসাবরক্ষণ",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1
        },
        {
          "id": "S2-U1-T20",
          "semId": 2,
          "unitId": "U1",
          "order": 20,
          "title": "Purchase and sale of depreciable assets",
          "titleBn": "অবচয়যোগ্য সম্পদ ক্রয় ও বিক্রয় সংক্রান্ত হিসাব",
          "type": "N",
          "lessonCount": 22,
          "priorityClass": "A",
          "markWeight": 1
        }
      ]
    },
    {
      "id": "U2",
      "semId": 2,
      "title": "Final Accounts of Sole Proprietor",
      "titleBn": "একমালিকানা কারবারের চূড়ান্ত হিসাব",
      "marks": 10,
      "hours": 20,
      "topics": [
        {
          "id": "S2-U2-T01",
          "semId": 2,
          "unitId": "U2",
          "order": 1,
          "title": "Final accounts: meaning, objectives, importance",
          "titleBn": "চূড়ান্ত হিসাব: অর্থ, উদ্দেশ্য ও গুরুত্ব",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 0.91
        },
        {
          "id": "S2-U2-T02",
          "semId": 2,
          "unitId": "U2",
          "order": 2,
          "title": "Manufacturing account",
          "titleBn": "উৎপাদন হিসাব: প্রত্যক্ষ কাঁচামাল, শ্রম ও কারখানা উপরিখরচ",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 0.91
        },
        {
          "id": "S2-U2-T03",
          "semId": 2,
          "unitId": "U2",
          "order": 3,
          "title": "Trading account",
          "titleBn": "ক্রয়-বিক্রয় হিসাব: মোট লাভ ও বিক্রিত পণ্যের ব্যয়",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 0.91
        },
        {
          "id": "S2-U2-T04",
          "semId": 2,
          "unitId": "U2",
          "order": 4,
          "title": "Profit and loss account",
          "titleBn": "লাভ-ক্ষতি হিসাব: নিট লাভ ও পরিচালন মুনাফা",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 0.91
        },
        {
          "id": "S2-U2-T05",
          "semId": 2,
          "unitId": "U2",
          "order": 5,
          "title": "Balance sheet",
          "titleBn": "উদ্বৃত্তপত্র: বিন্যাস ও সজ্জাকরণ (তারল্য ও স্থায়িত্ব ক্রম)",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 0.91
        },
        {
          "id": "S2-U2-T06",
          "semId": 2,
          "unitId": "U2",
          "order": 6,
          "title": "Adjustments I",
          "titleBn": "সমন্বয় ১: সমাপনী মজুত, বকেয়া খরচ ও অগ্রিম খরচ",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 0.91
        },
        {
          "id": "S2-U2-T07",
          "semId": 2,
          "unitId": "U2",
          "order": 7,
          "title": "Adjustments II",
          "titleBn": "সমন্বয় ২: প্রাপ্য আয় ও অগ্রিম প্রাপ্ত আয়",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 0.91
        },
        {
          "id": "S2-U2-T08",
          "semId": 2,
          "unitId": "U2",
          "order": 8,
          "title": "Adjustments III",
          "titleBn": "সমন্বয় ৩: অবচয়, অনাদায়ী পাওনা ও সন্দেহজনক দেনা সংস্থান",
          "type": "N",
          "lessonCount": 22,
          "priorityClass": "A",
          "markWeight": 0.91
        },
        {
          "id": "S2-U2-T09",
          "semId": 2,
          "unitId": "U2",
          "order": 9,
          "title": "Adjustments IV",
          "titleBn": "সমন্বয় ৪: দেনাদারের ওপর বাট্টা সংস্থান",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 0.91
        },
        {
          "id": "S2-U2-T10",
          "semId": 2,
          "unitId": "U2",
          "order": 10,
          "title": "Adjustments V",
          "titleBn": "সমন্বয় ৫: অস্বাভাবিক ক্ষতি, ব্যক্তিগত প্রয়োজনে পণ্য উত্তোলন ও ম্যানেজারের কমিশন",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 0.91
        },
        {
          "id": "S2-U2-T11",
          "semId": 2,
          "unitId": "U2",
          "order": 11,
          "title": "Complete final accounts with adjustments",
          "titleBn": "সমন্বয়সহ সমন্বিত পূর্ণাঙ্গ চূড়ান্ত হিসাব প্রস্তুতকরণ",
          "type": "N",
          "lessonCount": 24,
          "priorityClass": "A",
          "markWeight": 0.91
        }
      ]
    },
    {
      "id": "U3",
      "semId": 2,
      "title": "Accounts of Non-Profit Seeking Organisations",
      "titleBn": "অমুনাফাভোগী প্রতিষ্ঠানের হিসাবরক্ষণ",
      "marks": 5,
      "hours": 10,
      "topics": [
        {
          "id": "S2-U3-T01",
          "semId": 2,
          "unitId": "U3",
          "order": 1,
          "title": "Non-profit organisations: concept",
          "titleBn": "অমুনাফাভোগী প্রতিষ্ঠান: অর্থ ও প্রয়োজনীয়তা",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S2-U3-T02",
          "semId": 2,
          "unitId": "U3",
          "order": 2,
          "title": "Receipts and payments account",
          "titleBn": "প্রাপ্তি ও প্রদান হিসাব: বৈশিষ্ট্য ও প্রস্তুত প্রণালী",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S2-U3-T03",
          "semId": 2,
          "unitId": "U3",
          "order": 3,
          "title": "Income and expenditure account",
          "titleBn": "আয় ও ব্যয় হিসাব: বকেয়া ভিত্তি ও উদ্বৃত্ত বা ঘাটতি নির্ণয়",
          "type": "M",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S2-U3-T04",
          "semId": 2,
          "unitId": "U3",
          "order": 4,
          "title": "Income and expenditure from receipts and payments",
          "titleBn": "প্রাপ্তি-প্রদান হিসাব থেকে আয়-ব্যয় হিসাব প্রস্তুতকরণ ও চাঁদার সমন্বয়",
          "type": "N",
          "lessonCount": 22,
          "priorityClass": "A",
          "markWeight": 1.25
        }
      ]
    },
    {
      "id": "U4",
      "semId": 2,
      "title": "Accounts from Incomplete Records",
      "titleBn": "একতরফা বা অসম্পূর্ণ দাখিলা পদ্ধতির হিসাব",
      "marks": 5,
      "hours": 10,
      "topics": [
        {
          "id": "S2-U4-T01",
          "semId": 2,
          "unitId": "U4",
          "order": 1,
          "title": "Incomplete records: features, reasons, limitations",
          "titleBn": "অসম্পূর্ণ দাখিলা: বৈশিষ্ট্য, কারণ ও সীমাবদ্ধতা",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S2-U4-T02",
          "semId": 2,
          "unitId": "U4",
          "order": 2,
          "title": "Statement of affairs",
          "titleBn": "বিষয় বিবরণী প্রস্তুতের মাধ্যমে প্রারম্ভিক ও সমাপনী মূলধন নির্ণয়",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S2-U4-T03",
          "semId": 2,
          "unitId": "U4",
          "order": 3,
          "title": "Statement of profit or loss",
          "titleBn": "লাভ-ক্ষতি বিবরণীর মাধ্যমে নিট মুনাফা গণনা",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S2-U4-T04",
          "semId": 2,
          "unitId": "U4",
          "order": 4,
          "title": "Integrated incomplete-records problems",
          "titleBn": "বিষয় বিবরণী ও লাভ-ক্ষতির সমন্বিত সমস্যা",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1.25
        }
      ]
    }
  ]
},
  3: {
  "id": 3,
  "title": "Semester 3: Company Accounts & Analysis",
  "totalMarks": 40,
  "examFormat": "mcq",
  "units": [
    {
      "id": "U1",
      "semId": 3,
      "title": "Accounting for Partnership Firms I",
      "titleBn": "অংশীদারি কারবারের হিসাবরক্ষণ ১",
      "marks": 15,
      "hours": 35,
      "topics": [
        {
          "id": "S3-U1-T01",
          "semId": 3,
          "unitId": "U1",
          "order": 1,
          "title": "Partnership: meaning and features",
          "titleBn": "অংশীদারি কারবার: অর্থ, বৈশিষ্ট্য ও দায়",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 0.94
        },
        {
          "id": "S3-U1-T02",
          "semId": 3,
          "unitId": "U1",
          "order": 2,
          "title": "Partnership deed",
          "titleBn": "অংশীদারি চুক্তিপত্র: বিষয়বস্তু ও গুরুত্ব",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 0.94
        },
        {
          "id": "S3-U1-T03",
          "semId": 3,
          "unitId": "U1",
          "order": 3,
          "title": "Partnership Act 1932 when there is no deed",
          "titleBn": "চুক্তিপত্রের অনুপস্থিতিতে ১৯৩২ সালের অংশীদারি আইনের ধারা",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 0.94
        },
        {
          "id": "S3-U1-T04",
          "semId": 3,
          "unitId": "U1",
          "order": 4,
          "title": "Fixed vs fluctuating capital accounts",
          "titleBn": "স্থায়ী মূলধন বনাম পরিবর্তনশীল মূলধন পদ্ধতি ও চলতি হিসাব",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 0.94
        },
        {
          "id": "S3-U1-T05",
          "semId": 3,
          "unitId": "U1",
          "order": 5,
          "title": "Profit and loss appropriation account",
          "titleBn": "লাভ-ক্ষতি বণ্টন হিসাব: অর্থ, ছক ও বৈশিষ্ট্য",
          "type": "M",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 0.94
        },
        {
          "id": "S3-U1-T06",
          "semId": 3,
          "unitId": "U1",
          "order": 6,
          "title": "Interest on capital",
          "titleBn": "মূলধনের ওপর সুদ গণনা ও পর্যাপ্ত মুনাফার নিয়ম",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 0.94
        },
        {
          "id": "S3-U1-T07",
          "semId": 3,
          "unitId": "U1",
          "order": 7,
          "title": "Interest on drawings",
          "titleBn": "উত্তোলনের সুদের গড় সময়বিধি ও হিসাবরক্ষণ",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 0.94
        },
        {
          "id": "S3-U1-T08",
          "semId": 3,
          "unitId": "U1",
          "order": 8,
          "title": "Salary, commission and division of profit",
          "titleBn": "অংশীদারদের বেতন, কমিশন ও অবশিষ্টাংশ মুনাফা বণ্টন",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 0.94
        },
        {
          "id": "S3-U1-T09",
          "semId": 3,
          "unitId": "U1",
          "order": 9,
          "title": "Guarantee of profits",
          "titleBn": "মুনাফার নিশ্চয়তা (Guarantee of Profits) ও ঘাটতি পূরণ",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 0.94
        },
        {
          "id": "S3-U1-T10",
          "semId": 3,
          "unitId": "U1",
          "order": 10,
          "title": "Past adjustments I",
          "titleBn": "পূর্ববর্তী সমন্বয় ১: মূলধনের সুদ ও উত্তোলনের সুদের ভুল সংশোধন",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 0.94
        },
        {
          "id": "S3-U1-T11",
          "semId": 3,
          "unitId": "U1",
          "order": 11,
          "title": "Past adjustments II",
          "titleBn": "পূর্ববর্তী সমন্বয় ২: বেতন বাদ পড়া ও ভুল অনুপাতে মুনাফা বণ্টনের একক দাখিলা",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 0.94
        },
        {
          "id": "S3-U1-T12",
          "semId": 3,
          "unitId": "U1",
          "order": 12,
          "title": "Goodwill: meaning, nature and factors",
          "titleBn": "সুনাম: অর্থ, প্রকৃতি ও সুনাম সৃষ্টির উপাদানসমূহ",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 0.94
        },
        {
          "id": "S3-U1-T13",
          "semId": 3,
          "unitId": "U1",
          "order": 13,
          "title": "Goodwill: average profit method",
          "titleBn": "সুনামের গড় মুনাফা পদ্ধতি (সাধারণ ও ভারযুক্ত গড়)",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 0.94
        },
        {
          "id": "S3-U1-T14",
          "semId": 3,
          "unitId": "U1",
          "order": 14,
          "title": "Goodwill: super profit method",
          "titleBn": "সুনামের অতিমুনাফা পদ্ধতি (Super Profit Method)",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 0.94
        },
        {
          "id": "S3-U1-T15",
          "semId": 3,
          "unitId": "U1",
          "order": 15,
          "title": "Goodwill: capitalisation method",
          "titleBn": "সুনামের মূলধনীকরণ পদ্ধতি (গড় ও অতিমুনাফার মূলধনীকরণ)",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 0.94
        },
        {
          "id": "S3-U1-T16",
          "semId": 3,
          "unitId": "U1",
          "order": 16,
          "title": "Accounting standard and goodwill recognition",
          "titleBn": "হিসাব মানক অনুসারে ক্রয়কৃত সুনাম ও স্ব-সৃষ্ট সুনামের স্বীকৃতি",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 0.94
        }
      ]
    },
    {
      "id": "U2",
      "semId": 3,
      "title": "Accounting for Company I",
      "titleBn": "কোম্পানি হিসাবরক্ষণ ১",
      "marks": 10,
      "hours": 25,
      "topics": [
        {
          "id": "S3-U2-T01",
          "semId": 3,
          "unitId": "U2",
          "order": 1,
          "title": "Companies: features and types",
          "titleBn": "যৌথমূলধনী কোম্পানি: বৈশিষ্ট্য ও প্রকারভেদ",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S3-U2-T02",
          "semId": 3,
          "unitId": "U2",
          "order": 2,
          "title": "Shares and share capital",
          "titleBn": "শেয়ার ও শেয়ার মূলধনের শ্রেণিবিভাগ",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S3-U2-T03",
          "semId": 3,
          "unitId": "U2",
          "order": 3,
          "title": "Debentures",
          "titleBn": "ঋণপত্র বা ডিবেঞ্চার: অর্থ, শ্রেণিবিভাগ ও শেয়ারের সঙ্গে পার্থক্য",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S3-U2-T04",
          "semId": 3,
          "unitId": "U2",
          "order": 4,
          "title": "Issue of debentures at par and at a premium",
          "titleBn": "সমমূল্যে ও প্রিমিয়ামে ডিবেঞ্চার বিলি সংক্রান্ত দাখিলা",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S3-U2-T05",
          "semId": 3,
          "unitId": "U2",
          "order": 5,
          "title": "Issue of debentures at a discount",
          "titleBn": "বাট্টায় ডিবেঞ্চার বিলি ও অবহারের হিসাব",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S3-U2-T06",
          "semId": 3,
          "unitId": "U2",
          "order": 6,
          "title": "Issue of debentures for consideration other than cash",
          "titleBn": "নগদ ব্যতীত অন্য প্রতিদানে ডিবেঞ্চার বিলি",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S3-U2-T07",
          "semId": 3,
          "unitId": "U2",
          "order": 7,
          "title": "Issue of debentures with terms of redemption",
          "titleBn": "পরিশোধের শর্তযুক্ত ডিবেঞ্চার বিলি ও বিলির ক্ষতি নির্ণয়",
          "type": "N",
          "lessonCount": 22,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S3-U2-T08",
          "semId": 3,
          "unitId": "U2",
          "order": 8,
          "title": "Writing off discount or loss on issue",
          "titleBn": "ডিবেঞ্চার বিলির বাট্টা বা ক্ষতি অবলোপনের নিয়ম ও দাখিলা",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1.25
        }
      ]
    },
    {
      "id": "U3A",
      "semId": 3,
      "title": "Analysis of Financial Statements",
      "titleBn": "আর্থিক বিবরণী বিশ্লেষণ",
      "marks": 15,
      "hours": 40,
      "topics": [
        {
          "id": "S3-U3A-T01",
          "semId": 3,
          "unitId": "U3A",
          "order": 1,
          "title": "Financial statement analysis",
          "titleBn": "আর্থিক বিবরণী বিশ্লেষণ: অর্থ, উদ্দেশ্য ও সীমাবদ্ধতা",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 1.5
        },
        {
          "id": "S3-U3A-T02",
          "semId": 3,
          "unitId": "U3A",
          "order": 2,
          "title": "Accounting ratios: meaning and classification",
          "titleBn": "হিসাব অনুপাত: অর্থ, উদ্দেশ্য ও ৪টি প্রধান শ্রেণি",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 1.5
        },
        {
          "id": "S3-U3A-T03",
          "semId": 3,
          "unitId": "U3A",
          "order": 3,
          "title": "Liquidity ratios",
          "titleBn": "তারল্য অনুপাত: চলতি অনুপাত ও তড়িৎ অনুপাত",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1.5
        },
        {
          "id": "S3-U3A-T04",
          "semId": 3,
          "unitId": "U3A",
          "order": 4,
          "title": "Solvency ratios I",
          "titleBn": "স্বচ্ছলতা অনুপাত ১: ঋণ-ইক্যুইটি, মোট সম্পদ-ঋণ ও স্বত্বাধিকার অনুপাত",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1.5
        },
        {
          "id": "S3-U3A-T05",
          "semId": 3,
          "unitId": "U3A",
          "order": 5,
          "title": "Solvency ratios II",
          "titleBn": "স্বচ্ছলতা অনুপাত ২: সুদ সুরক্ষা অনুপাত ও মূলধন নিয়োগে ঋণ অনুপাত",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1.5
        },
        {
          "id": "S3-U3A-T06",
          "semId": 3,
          "unitId": "U3A",
          "order": 6,
          "title": "Activity ratios I",
          "titleBn": "দক্ষতা বা আবর্তন অনুপাত ১: মজুত আবর্তন, দেনাদার ও পাওনাদার আবর্তন অনুপাত",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1.5
        },
        {
          "id": "S3-U3A-T07",
          "semId": 3,
          "unitId": "U3A",
          "order": 7,
          "title": "Activity ratios II",
          "titleBn": "দক্ষতা বা আবর্তন অনুপাত ২: স্থায়ী সম্পদ, নিট সম্পদ ও কার্যনির্বাহী মূলধন আবর্তন",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1.5
        },
        {
          "id": "S3-U3A-T08",
          "semId": 3,
          "unitId": "U3A",
          "order": 8,
          "title": "Profitability ratios",
          "titleBn": "মুনাফা অর্জন ক্ষমতা অনুপাত: মোট লাভ, পরিচালন লাভ, নিট লাভ ও বিনিয়োগে প্রত্যর্পণ",
          "type": "N",
          "lessonCount": 22,
          "priorityClass": "A",
          "markWeight": 1.5
        },
        {
          "id": "S3-U3A-T09",
          "semId": 3,
          "unitId": "U3A",
          "order": 9,
          "title": "Comparative and common-size statements",
          "titleBn": "তুলনামূলক বিবরণী ও সাধারণ আকারের আর্থিক বিবরণী প্রস্তুতকরণ",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1.5
        },
        {
          "id": "S3-U3A-T10",
          "semId": 3,
          "unitId": "U3A",
          "order": 10,
          "title": "Integrated ratio analysis",
          "titleBn": "অনুপাতভিত্তিক সমন্বিত বিশ্লেষণ ও অনুপাত থেকে উদ্বৃত্তপত্র প্রস্তুত",
          "type": "N",
          "lessonCount": 24,
          "priorityClass": "A",
          "markWeight": 1.5
        }
      ],
      "trackRequired": "analysis"
    },
    {
      "id": "U3B",
      "semId": 3,
      "title": "Computerized Accounts I",
      "titleBn": "কম্পিউটারাইজড হিসাবরক্ষণ ১",
      "marks": 15,
      "hours": 40,
      "topics": [
        {
          "id": "S3-U3B-T01",
          "semId": 3,
          "unitId": "U3B",
          "order": 1,
          "title": "Electronic spreadsheet: concept and data entry",
          "titleBn": "ইলেকট্রনিক স্প্রেডশিট: ধারণা ও ডেটা এন্ট্রি",
          "type": "M",
          "lessonCount": 14,
          "priorityClass": "A",
          "markWeight": 2.14
        },
        {
          "id": "S3-U3B-T02",
          "semId": 3,
          "unitId": "U3B",
          "order": 2,
          "title": "Text management, cell and data formatting",
          "titleBn": "টেক্সট ব্যবস্থাপনা, সেল ও ডেটা ফরম্যাটিং",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 2.14
        },
        {
          "id": "S3-U3B-T03",
          "semId": 3,
          "unitId": "U3B",
          "order": 3,
          "title": "Output reports",
          "titleBn": "হিসাবরক্ষণ আউটপুট রিপোর্ট প্রস্তুত ও প্রদর্শন",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 2.14
        },
        {
          "id": "S3-U3B-T04",
          "semId": 3,
          "unitId": "U3B",
          "order": 4,
          "title": "Pivot tables",
          "titleBn": "পিভট টেবিলের সাহায্যে আর্থিক তথ্যের সারসংক্ষেপ",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 2.14
        },
        {
          "id": "S3-U3B-T05",
          "semId": 3,
          "unitId": "U3B",
          "order": 5,
          "title": "Common spreadsheet errors",
          "titleBn": "স্প্রেডশিটের সাধারণ ভুলভ্রান্তি ও সূত্র ত্রুটি সংশোধন",
          "type": "M",
          "lessonCount": 14,
          "priorityClass": "A",
          "markWeight": 2.14
        },
        {
          "id": "S3-U3B-T06",
          "semId": 3,
          "unitId": "U3B",
          "order": 6,
          "title": "Payroll accounting",
          "titleBn": "বেতন হিসাবরক্ষণ: মূল বেতন, ভাতা, কর্তন ও নিট বেতন বিবরণী",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 2.14
        },
        {
          "id": "S3-U3B-T07",
          "semId": 3,
          "unitId": "U3B",
          "order": 7,
          "title": "Charts and graphs",
          "titleBn": "চার্ট ও গ্রাফ: শ্রেণিবিভাগ ও স্প্রেডশিটে চিত্রায়ণ",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 2.14
        }
      ],
      "trackRequired": "computer"
    }
  ]
},
  4: {
  "id": 4,
  "title": "Semester 4: Cash Flow, Ratios & Computers",
  "totalMarks": 40,
  "examFormat": "written",
  "units": [
    {
      "id": "U1",
      "semId": 4,
      "title": "Accounting for Partnership Firms II",
      "titleBn": "অংশীদারি কারবারের হিসাবরক্ষণ ২",
      "marks": 25,
      "hours": 50,
      "topics": [
        {
          "id": "S4-U1-T01",
          "semId": 4,
          "unitId": "U1",
          "order": 1,
          "title": "Change in profit-sharing ratio",
          "titleBn": "লাভ-ক্ষতির অনুপাত পরিবর্তন ও ত্যাগ বা লাভ অনুপাত গণনা",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T02",
          "semId": 4,
          "unitId": "U1",
          "order": 2,
          "title": "Revaluation of assets and reassessment of liabilities",
          "titleBn": "সম্পদ ও দায়ের পুনর্মূল্যায়ন হিসাব ও পুরাতন অনুপাতে বণ্টন",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T03",
          "semId": 4,
          "unitId": "U1",
          "order": 3,
          "title": "Reserves, accumulated profits and losses",
          "titleBn": "সঞ্চিতি এবং পুঞ্জীভূত লাভ-ক্ষতির বণ্টন দাখিলা",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T04",
          "semId": 4,
          "unitId": "U1",
          "order": 4,
          "title": "Admission: new ratio and sacrificing ratio",
          "titleBn": "নতুন অংশীদারের প্রবেশ: নতুন অনুপাত ও ত্যাগ অনুপাত গণনা",
          "type": "N",
          "lessonCount": 22,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T05",
          "semId": 4,
          "unitId": "U1",
          "order": 5,
          "title": "Admission: goodwill",
          "titleBn": "অংশীদারের প্রবেশে সুনাম প্রিমিয়াম ও সুপ্ত সুনাম (Hidden Goodwill)",
          "type": "N",
          "lessonCount": 22,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T06",
          "semId": 4,
          "unitId": "U1",
          "order": 6,
          "title": "Admission: revaluation and reassessment",
          "titleBn": "নতুন অংশীদারের প্রবেশে পুনর্মূল্যায়ন হিসাব",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T07",
          "semId": 4,
          "unitId": "U1",
          "order": 7,
          "title": "Admission: reserves, accumulated profits and losses",
          "titleBn": "নতুন অংশীদারের প্রবেশে পুরাতন সঞ্চিতির স্থানান্তর",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T08",
          "semId": 4,
          "unitId": "U1",
          "order": 8,
          "title": "Admission: adjustment of capital accounts",
          "titleBn": "মূলধন হিসাবের সমন্বয়সাধন ও নতুন অংশীদারের দেয় মূলধন",
          "type": "N",
          "lessonCount": 22,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T09",
          "semId": 4,
          "unitId": "U1",
          "order": 9,
          "title": "Admission: capital accounts and balance sheet",
          "titleBn": "প্রবেশের পর অংশীদারদের মূলধন হিসাব ও পুনর্গঠিত উদ্বৃত্তপত্র",
          "type": "N",
          "lessonCount": 24,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T10",
          "semId": 4,
          "unitId": "U1",
          "order": 10,
          "title": "Retirement: new ratio and gaining ratio",
          "titleBn": "অংশীদারের অবসরগ্রহণ: নতুন অনুপাত ও লাভ অনুপাত নির্ণয়",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T11",
          "semId": 4,
          "unitId": "U1",
          "order": 11,
          "title": "Retirement: goodwill",
          "titleBn": "অবসরপ্রাপ্ত অংশীদারের সুনামের অংশ সমন্বয়",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T12",
          "semId": 4,
          "unitId": "U1",
          "order": 12,
          "title": "Retirement: revaluation, reserves and accumulated profits",
          "titleBn": "অবসরগ্রহণে পুনর্মূল্যায়ন ও সঞ্চিতির হিসাব",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T13",
          "semId": 4,
          "unitId": "U1",
          "order": 13,
          "title": "Retirement: capital accounts, settlement and loan account",
          "titleBn": "অবসরকালীন দেনা নিষ্পত্তি, ঋণ হিসাব ও উদ্বৃত্তপত্র",
          "type": "N",
          "lessonCount": 22,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T14",
          "semId": 4,
          "unitId": "U1",
          "order": 14,
          "title": "Death: share of profit till date of death",
          "titleBn": "অংশীদারের মৃত্যু: মৃত্যুর দিন পর্যন্ত মুনাফার অংশ নির্ণয়",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T15",
          "semId": 4,
          "unitId": "U1",
          "order": 15,
          "title": "Death: deceased partner's capital account and executor's account",
          "titleBn": "মৃত অংশীদারের মূলধন ও নির্বাহকের (Executor) হিসাব",
          "type": "N",
          "lessonCount": 22,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T16",
          "semId": 4,
          "unitId": "U1",
          "order": 16,
          "title": "Dissolution: meaning and types",
          "titleBn": "অংশীদারি কারবারের বিলোপসাধন: অর্থ ও প্রকারভেদ",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T17",
          "semId": 4,
          "unitId": "U1",
          "order": 17,
          "title": "Realisation account",
          "titleBn": "সম্পদ ও দায় আদায়-নিষ্পত্তি হিসাব (Realisation A/c)",
          "type": "N",
          "lessonCount": 24,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T18",
          "semId": 4,
          "unitId": "U1",
          "order": 18,
          "title": "Capital accounts and cash or bank account in dissolution",
          "titleBn": "বিলোপসাধনে অংশীদারদের মূলধন ও ব্যাংক হিসাবের চূড়ান্ত নিষ্পত্তি",
          "type": "N",
          "lessonCount": 22,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T19",
          "semId": 4,
          "unitId": "U1",
          "order": 19,
          "title": "Integrated dissolution problems",
          "titleBn": "বিলোপসাধনের সমন্বিত পূর্ণাঙ্গ গাণিতিক সমস্যা",
          "type": "N",
          "lessonCount": 24,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U1-T20",
          "semId": 4,
          "unitId": "U1",
          "order": 20,
          "title": "Integrated admission and retirement problems",
          "titleBn": "প্রবেশ ও অবসরগ্রহণের সমন্বিত জটিল সমস্যা সমাধান",
          "type": "N",
          "lessonCount": 24,
          "priorityClass": "A",
          "markWeight": 1.25
        }
      ]
    },
    {
      "id": "U2",
      "semId": 4,
      "title": "Accounting for Share Capital II",
      "titleBn": "শেয়ার মূলধন হিসাবরক্ষণ ২",
      "marks": 10,
      "hours": 20,
      "topics": [
        {
          "id": "S4-U2-T01",
          "semId": 4,
          "unitId": "U2",
          "order": 1,
          "title": "Issue and allotment of shares",
          "titleBn": "শেয়ার বিলি ও বণ্টন: আবেদন, বণ্টন ও তলব দাখিলা",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U2-T02",
          "semId": 4,
          "unitId": "U2",
          "order": 2,
          "title": "Pro-rata allotment",
          "titleBn": "অনুপাতিক হারে শেয়ার বণ্টন (Pro-rata Allotment)",
          "type": "N",
          "lessonCount": 22,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U2-T03",
          "semId": 4,
          "unitId": "U2",
          "order": 3,
          "title": "Over-subscription and under-subscription",
          "titleBn": "অতিরিক্ত আবেদন ও অপূর্ণ আবেদনের হিসাবরক্ষণ",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U2-T04",
          "semId": 4,
          "unitId": "U2",
          "order": 4,
          "title": "Par, premium, calls in advance and calls in arrears",
          "titleBn": "সমমূল্য, প্রিমিয়াম, অগ্রিম তলব ও বকেয়া তলবের দাখিলা",
          "type": "N",
          "lessonCount": 20,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U2-T05",
          "semId": 4,
          "unitId": "U2",
          "order": 5,
          "title": "Shares issued for consideration other than cash",
          "titleBn": "নগদ ব্যতীত অন্য প্রতিদানে শেয়ার বিলি",
          "type": "N",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U2-T06",
          "semId": 4,
          "unitId": "U2",
          "order": 6,
          "title": "Forfeiture of shares",
          "titleBn": "শেয়ার বাজেয়াপ্তকরণ (Forfeiture of Shares) ও দাখিলা",
          "type": "N",
          "lessonCount": 22,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U2-T07",
          "semId": 4,
          "unitId": "U2",
          "order": 7,
          "title": "Reissue of forfeited shares",
          "titleBn": "বাজেয়াপ্ত শেয়ারের পুনঃবিলি ও মূলধন সঞ্চিতি স্থানান্তর",
          "type": "N",
          "lessonCount": 22,
          "priorityClass": "A",
          "markWeight": 1.25
        },
        {
          "id": "S4-U2-T08",
          "semId": 4,
          "unitId": "U2",
          "order": 8,
          "title": "Disclosure of share capital",
          "titleBn": "কোম্পানি আইন ২০১৩ তফসিল ৩ অনুযায়ী উদ্বৃত্তপত্রে শেয়ার মূলধন উপস্থাপন",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 1.25
        }
      ]
    },
    {
      "id": "U3A",
      "semId": 4,
      "title": "Cash Flow Statement",
      "titleBn": "নগদ প্রবাহ বিবরণী",
      "marks": 5,
      "hours": 10,
      "topics": [
        {
          "id": "S4-U3A-T01",
          "semId": 4,
          "unitId": "U3A",
          "order": 1,
          "title": "Cash flow statement: meaning, objectives, benefits",
          "titleBn": "নগদ প্রবাহ বিবরণী: অর্থ, উদ্দেশ্য ও সুবিধা",
          "type": "T",
          "lessonCount": 12,
          "priorityClass": "A",
          "markWeight": 1.67
        },
        {
          "id": "S4-U3A-T02",
          "semId": 4,
          "unitId": "U3A",
          "order": 2,
          "title": "Classification of activities",
          "titleBn": "কার্যক্রমের শ্রেণীবিন্যাস: পরিচালন, বিনিয়োগ ও আর্থিক কার্যক্রম",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 1.67
        },
        {
          "id": "S4-U3A-T03",
          "semId": 4,
          "unitId": "U3A",
          "order": 3,
          "title": "Preparing the statement (indirect method)",
          "titleBn": "পরোক্ষ পদ্ধতিতে নগদ প্রবাহ বিবরণী প্রস্তুতকরণ (AS 3)",
          "type": "N",
          "lessonCount": 24,
          "priorityClass": "A",
          "markWeight": 1.67
        }
      ],
      "trackRequired": "analysis"
    },
    {
      "id": "U3B",
      "semId": 4,
      "title": "Computerized Accounts II",
      "titleBn": "কম্পিউটারাইজড হিসাবরক্ষণ ২",
      "marks": 5,
      "hours": 10,
      "topics": [
        {
          "id": "S4-U3B-T01",
          "semId": 4,
          "unitId": "U3B",
          "order": 1,
          "title": "Database management system",
          "titleBn": "ডাটাবেস ম্যানেজমেন্ট সিস্টেম (DBMS): প্রয়োজনীয়তা ও গঠন",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 1.67
        },
        {
          "id": "S4-U3B-T02",
          "semId": 4,
          "unitId": "U3B",
          "order": 2,
          "title": "Creating accounting data tables",
          "titleBn": "হিসাব তথ্যের টেবিল তৈরি: ফিল্ড, ডেটা টাইপ ও কী (Key)",
          "type": "M",
          "lessonCount": 16,
          "priorityClass": "A",
          "markWeight": 1.67
        },
        {
          "id": "S4-U3B-T03",
          "semId": 4,
          "unitId": "U3B",
          "order": 3,
          "title": "Queries, forms and reports",
          "titleBn": "এমএস এক্সেস: কোয়েরি, ফর্ম ও প্রতিবেদন প্রস্তুতকরণ",
          "type": "M",
          "lessonCount": 18,
          "priorityClass": "A",
          "markWeight": 1.67
        }
      ],
      "trackRequired": "computer"
    }
  ]
},
};

export const SEMESTER_LIST: SemesterMeta[] = [
  SYLLABUS[1],
  SYLLABUS[2],
  SYLLABUS[3],
  SYLLABUS[4],
];

export function getSemester(semId: 1 | 2 | 3 | 4): SemesterMeta {
  return SYLLABUS[semId];
}

export function getUnit(semId: 1 | 2 | 3 | 4, unitId: string): UnitMeta | undefined {
  return SYLLABUS[semId]?.units.find((u) => u.id === unitId);
}

export function getTopic(topicId: string): TopicMeta | undefined {
  for (const sem of SEMESTER_LIST) {
    for (const unit of sem.units) {
      const found = unit.topics.find((t) => t.id === topicId);
      if (found) return found;
    }
  }
  return undefined;
}
