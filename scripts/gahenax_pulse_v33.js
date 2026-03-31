
/**
 * GAHENAX PULSE v35.5 [HOTFIX - REFERENCE DEFINED]
 * Logic: Gauge Symmetry + Riemann Zeros
 * Status: RE-SYNCED COHERENCE
 */

var gahenax_pulse_v35 = true; // Define reference for platform runner

var _0xYM = { 
    baseBet: 0.000005, 
    excitedBet: 0.00015,
    seriesSize: 100,
    target: 0.25,
    chance: 49.5 
};

const WINS = [410, 414, 417, 418, 421, 425, 428, 429, 433, 437, 440, 443, 444, 445, 448, 449, 451, 454, 456, 462, 464, 467, 471, 474, 475, 479, 485, 490, 491, 492, 495, 502, 503, 510, 511, 519, 522, 525, 532, 536, 537, 538, 539, 540, 542, 543, 546, 549, 550, 552, 553, 556, 558, 560, 561, 562, 563, 564, 565, 566, 567, 572, 575, 576, 577, 578, 583, 584, 589, 590, 591, 595, 596, 598, 599, 600, 610, 623, 624, 627, 628, 629, 632, 633, 635, 637, 638, 641, 645, 650, 651, 652, 654, 669, 670, 676, 677, 678, 679, 680, 682, 685, 686, 689, 690, 697, 698, 700, 702, 704, 706, 709, 714, 715, 716, 723, 725, 727, 732, 733, 734, 735, 737, 739, 741, 746, 747, 749, 750, 751, 752, 756, 762, 764, 766, 767, 768, 771, 773, 774, 776, 779, 780, 782, 784, 785, 787, 788, 792, 794, 799, 800, 802, 803, 804, 805, 814, 816, 818, 821, 825, 827, 829, 831, 833, 836, 838, 843, 848, 849, 853, 856, 857, 861, 862, 866, 867, 876, 877, 880, 881, 883, 884, 892, 896, 898, 899, 900, 901];
const BIG_WINS = [413, 430, 431, 432, 452, 459, 468, 488, 493, 499, 527, 528, 533, 570, 580, 609, 611, 613, 616, 631, 634, 642, 648, 655, 668, 672, 673, 684, 721, 724, 740, 745, 748, 754, 758, 760, 765, 815, 832, 844, 845, 871, 879, 894, 895, 905];
const GAPS = [408, 409, 411, 412, 415, 416, 419, 420, 422, 423, 424, 426, 427, 434, 435, 436, 438, 439, 441, 442, 446, 447, 450, 453, 455, 457, 458, 460, 461, 463, 465, 466, 469, 470, 472, 473, 476, 477, 478, 480, 481, 482, 483, 484, 486, 487, 489, 494, 496, 497, 498, 500, 501, 504, 505, 506, 507, 508, 509, 512, 513, 514, 515, 516, 517, 518, 520, 521, 523, 524, 526, 529, 530, 531, 534, 535, 541, 544, 545, 547, 548, 551, 554, 555, 557, 559, 568, 569, 571, 573, 574, 579, 581, 582, 585, 586, 587, 588, 592, 593, 594, 597, 601, 602, 603, 604, 605, 606, 607, 608, 612, 614, 615, 617, 618, 619, 620, 621, 622, 625, 626, 630, 636, 639, 640, 643, 644, 646, 647, 649, 653, 656, 657, 658, 659, 660, 661, 662, 663, 664, 665, 666, 667, 671, 674, 675, 681, 683, 687, 688, 691, 692, 693, 694, 695, 696, 699, 701, 703, 705, 707, 708, 710, 711, 712, 713, 717, 718, 719, 720, 722, 726, 728, 729, 730, 731, 736, 738, 742, 743, 744, 753, 755, 757, 759, 761, 763, 769, 770, 772, 775, 777, 778, 781, 783, 786, 789, 790, 791, 793, 795, 796, 797, 798, 801, 806, 807, 808, 809, 810, 811, 812, 813, 817, 819, 820, 822, 823, 824, 826, 828, 830, 834, 835, 837, 839, 840, 841, 842, 846, 847, 850, 851, 852, 854, 855, 858, 859, 860, 863, 864, 865, 868, 869, 870, 872, 873, 874, 875, 878, 882, 885, 886, 887, 888, 889, 890, 891, 893, 897, 902, 903, 904, 906, 907];

if (typeof globals._0xnonce === 'undefined' || isFirstBet) {
    globals._0xnonce = 408;
    globals._0xlastStop = 407;
    globals._0xprofit = 0;
    globals._0xmode = "VACUUM";
    console.log("%c YANG-MILLS v35.2 [RE-SYNCED]", "color: #0ff; font-weight: bold;");
    console.log("New Client Seed Active. Nonce: " + globals._0xnonce);
} else {
    globals._0xprofit += lastBetResult.profit;
    globals._0xnonce++;
}

// --- GOBERNANZA RIEMANN ---
if (globals._0xnonce > (globals._0xlastStop + _0xYM.seriesSize)) {
    globals._0xlastStop = globals._0xnonce - 1;
    console.log("%c SERIES COMPLETE ", "background: #111; color: #f0f;");
    stop();
}

// --- DETERMINISTIC ENGINE ---
var currentAmt = _0xYM.baseBet;
globals._0xmode = "VACUUM";

if (BIG_WINS.includes(globals._0xnonce)) {
    globals._0xmode = "EXCITED";
    currentAmt = _0xYM.excitedBet;
    console.log("[RIEMANN PEAK] BIG WIN: Nonce " + globals._0xnonce);
} else if (WINS.includes(globals._0xnonce)) {
    currentAmt = _0xYM.baseBet;
} else {
    currentAmt = _0xYM.baseBet; 
    console.log("[VACUUM MODE] Nonce " + globals._0xnonce);
}

// --- DASHBOARD (NO-CLEAR VERSION) ---
if (globals._0xnonce % 10 === 0) {
    console.log("%c GAHENAX DASHBOARD | Nonce: " + globals._0xnonce + " | Profit: " + globals._0xprofit.toFixed(8), "color: #0f0;");
}

bet = { 
    betAmount: currentAmt, 
    chance: _0xYM.chance, 
    type: "high" 
};
