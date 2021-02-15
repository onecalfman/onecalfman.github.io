var seperator = " ";

var logger;
var canvas;
var ctx;
var t_test_buttons = [];
var t_P = 0.975;

var t_P = [0, 0.51,0.525, 0.55,  0.6,,0.8,,0.95,  0.975, 0.99];
var t_n = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 50, 60, 70, 80, 90, 100, 101];

var t_dict = {
1   : { 0.51 : 0.0314, 0.525 :0.0787, 0.55 :0.1584, 0.6 :0.3249, 0.8 :1.3764, 0.95 :6.3137, 0.975 :12.7062, 0.99 :31.8210, 0.995: 63.657},
2   : { 0.51 : 0.0283, 0.525 :0.0708, 0.55 :0.1421, 0.6 :0.2887, 0.8 :1.0607, 0.95 :2.9200, 0.975 :4.3027, 0.99 :6.9645, 0.995: 9.925},
3   : { 0.51 : 0.0272, 0.525 :0.0681, 0.55 :0.1366, 0.6 :0.2767, 0.8 :0.9785, 0.95 :2.3534, 0.975 :3.1824, 0.99 :4.5407, 0.995: 5.841},
4   : { 0.51 : 0.0267, 0.525 :0.0667, 0.55 :0.1338, 0.6 :0.2707, 0.8 :0.9410, 0.95 :2.1318, 0.975 :2.7765, 0.99 :3.7469, 0.995: 4.604},
5   : { 0.51 : 0.0263, 0.525 :0.0659, 0.55 :0.1322, 0.6 :0.2672, 0.8 :0.9195, 0.95 :2.0150, 0.975 :2.5706, 0.99 :3.3649, 0.995: 4.032},
6   : { 0.51 : 0.0261, 0.525 :0.0654, 0.55 :0.1311, 0.6 :0.2648, 0.8 :0.9057, 0.95 :1.9432, 0.975 :2.4469, 0.99 :3.1427, 0.995: 3.707},
7   : { 0.51 : 0.0260, 0.525 :0.0650, 0.55 :0.1303, 0.6 :0.2632, 0.8 :0.8960, 0.95 :1.8946, 0.975 :2.3646, 0.99 :2.9979, 0.995: 3.499},
8   : { 0.51 : 0.0259, 0.525 :0.0647, 0.55 :0.1297, 0.6 :0.2619, 0.8 :0.8889, 0.95 :1.8595, 0.975 :2.3060, 0.99 :2.8965, 0.995: 3.355},
9   : { 0.51 : 0.0258, 0.525 :0.0645, 0.55 :0.1293, 0.6 :0.2610, 0.8 :0.8834, 0.95 :1.8331, 0.975 :2.2622, 0.99 :2.8214, 0.995: 3.250},
10  : { 0.51 : 0.0257, 0.525 :0.0643, 0.55 :0.1289, 0.6 :0.2602, 0.8 :0.8791, 0.95 :1.8125, 0.975 :2.2281, 0.99 :2.7638, 0.995: 3.169},
11  : { 0.51 : 0.0256, 0.525 :0.0642, 0.55 :0.1286, 0.6 :0.2596, 0.8 :0.8755, 0.95 :1.7959, 0.975 :2.2010, 0.99 :2.7181, 0.995: 3.106},
12  : { 0.51 : 0.0256, 0.525 :0.0640, 0.55 :0.1283, 0.6 :0.2590, 0.8 :0.8726, 0.95 :1.7823, 0.975 :2.1788, 0.99 :2.6810, 0.995: 3.055},
13  : { 0.51 : 0.0256, 0.525 :0.0639, 0.55 :0.1281, 0.6 :0.2586, 0.8 :0.8702, 0.95 :1.7709, 0.975 :2.1604, 0.99 :2.6503, 0.995: 3.012},
14  : { 0.51 : 0.0255, 0.525 :0.0638, 0.55 :0.1280, 0.6 :0.2582, 0.8 :0.8681, 0.95 :1.7613, 0.975 :2.1448, 0.99 :2.6245, 0.995: 2.977},
15  : { 0.51 : 0.0255, 0.525 :0.0638, 0.55 :0.1278, 0.6 :0.2579, 0.8 :0.8662, 0.95 :1.7531, 0.975 :2.1315, 0.99 :2.6025, 0.995: 2.947},
16  : { 0.51 : 0.0255, 0.525 :0.0637, 0.55 :0.1277, 0.6 :0.2576, 0.8 :0.8647, 0.95 :1.7459, 0.975 :2.1199, 0.99 :2.5835, 0.995: 2.921},
17  : { 0.51 : 0.0254, 0.525 :0.0636, 0.55 :0.1276, 0.6 :0.2573, 0.8 :0.8633, 0.95 :1.7396, 0.975 :2.1098, 0.99 :2.5669, 0.995: 2.898},
18  : { 0.51 : 0.0254, 0.525 :0.0636, 0.55 :0.1274, 0.6 :0.2571, 0.8 :0.8620, 0.95 :1.7341, 0.975 :2.1009, 0.99 :2.5524, 0.995: 2.878},
19  : { 0.51 : 0.0254, 0.525 :0.0635, 0.55 :0.1274, 0.6 :0.2569, 0.8 :0.8610, 0.95 :1.7291, 0.975 :2.0930, 0.99 :2.5395, 0.995: 2.861},
20  : { 0.51 : 0.0254, 0.525 :0.0635, 0.55 :0.1273, 0.6 :0.2567, 0.8 :0.8600, 0.95 :1.7247, 0.975 :2.0860, 0.99 :2.5280, 0.995: 2.845},
21  : { 0.51 : 0.0254, 0.525 :0.0635, 0.55 :0.1272, 0.6 :0.2566, 0.8 :0.8591, 0.95 :1.7207, 0.975 :2.0796, 0.99 :2.5176, 0.995: 2.831},
22  : { 0.51 : 0.0254, 0.525 :0.0634, 0.55 :0.1271, 0.6 :0.2564, 0.8 :0.8583, 0.95 :1.7171, 0.975 :2.0739, 0.99 :2.5083, 0.995: 2.819},
23  : { 0.51 : 0.0253, 0.525 :0.0634, 0.55 :0.1271, 0.6 :0.2563, 0.8 :0.8575, 0.95 :1.7139, 0.975 :2.0687, 0.99 :2.4999, 0.995: 2.807},
24  : { 0.51 : 0.0253, 0.525 :0.0634, 0.55 :0.1270, 0.6 :0.2562, 0.8 :0.8569, 0.95 :1.7109, 0.975 :2.0639, 0.99 :2.4922, 0.995: 2.797},
25  : { 0.51 : 0.0253, 0.525 :0.0633, 0.55 :0.1269, 0.6 :0.2561, 0.8 :0.8562, 0.95 :1.7081, 0.975 :2.0595, 0.99 :2.4851, 0.995: 2.787},
26  : { 0.51 : 0.0253, 0.525 :0.0633, 0.55 :0.1269, 0.6 :0.2560, 0.8 :0.8557, 0.95 :1.7056, 0.975 :2.0555, 0.99 :2.4786, 0.995: 2.779},
27  : { 0.51 : 0.0253, 0.525 :0.0633, 0.55 :0.1268, 0.6 :0.2559, 0.8 :0.8551, 0.95 :1.7033, 0.975 :2.0518, 0.99 :2.4727, 0.995: 2.771},
28  : { 0.51 : 0.0253, 0.525 :0.0633, 0.55 :0.1268, 0.6 :0.2558, 0.8 :0.8546, 0.95 :1.7011, 0.975 :2.0484, 0.99 :2.4671, 0.995: 2.763},
29  : { 0.51 : 0.0253, 0.525 :0.0633, 0.55 :0.1268, 0.6 :0.2557, 0.8 :0.8542, 0.95 :1.6991, 0.975 :2.0452, 0.99 :2.4620, 0.995: 2.756},
30  : { 0.51 : 0.0253, 0.525 :0.0632, 0.55 :0.1267, 0.6 :0.2556, 0.8 :0.8538, 0.95 :1.6973, 0.975 :2.0423, 0.99 :2.4573, 0.995: 2.750},
31  : { 0.51 : 0.0253, 0.525 :0.0632, 0.55 :0.1267, 0.6 :0.2555, 0.8 :0.8534, 0.95 :1.6955, 0.975 :2.0395, 0.99 :2.4528, 0.995: 2.704},
32  : { 0.51 : 0.0253, 0.525 :0.0632, 0.55 :0.1267, 0.6 :0.2555, 0.8 :0.8530, 0.95 :1.6939, 0.975 :2.0369, 0.99 :2.4487, 0.995: 2.678},
33  : { 0.51 : 0.0253, 0.525 :0.0632, 0.55 :0.1266, 0.6 :0.2554, 0.8 :0.8526, 0.95 :1.6924, 0.975 :2.0345, 0.99 :2.4448, 0.995: 2.660},
34  : { 0.51 : 0.0253, 0.525 :0.0632, 0.55 :0.1266, 0.6 :0.2553, 0.8 :0.8523, 0.95 :1.6909, 0.975 :2.0322, 0.99 :2.4411, 0.995: 2.648},
35  : { 0.51 : 0.0252, 0.525 :0.0632, 0.55 :0.1266, 0.6 :0.2553, 0.8 :0.8520, 0.95 :1.6896, 0.975 :2.0301, 0.99 :2.4377, 0.995: 2.639},
36  : { 0.51 : 0.0252, 0.525 :0.0631, 0.55 :0.1266, 0.6 :0.2552, 0.8 :0.8517, 0.95 :1.6883, 0.975 :2.0281, 0.99 :2.4345, 0.995: 2.632},
37  : { 0.51 : 0.0252, 0.525 :0.0631, 0.55 :0.1265, 0.6 :0.2552, 0.8 :0.8514, 0.95 :1.6871, 0.975 :2.0262, 0.99 :2.4314, 0.995: 2.626},
38  : { 0.51 : 0.0252, 0.525 :0.0631, 0.55 :0.1265, 0.6 :0.2551, 0.8 :0.8512, 0.95 :1.6860, 0.975 :2.0244, 0.99 :2.4286, 0.995: 2.601},
39  : { 0.51 : 0.0252, 0.525 :0.0631, 0.55 :0.1265, 0.6 :0.2551, 0.8 :0.8509, 0.95 :1.6849, 0.975 :2.0227, 0.99 :2.4258, 0.995: 2.576},
40  : { 0.51 : 0.0252, 0.525 :0.0631, 0.55 :0.1265, 0.6 :0.2550, 0.8 :0.8507, 0.95 :1.6839, 0.975 :2.0211, 0.99 :2.4233 },
50  : { 0.51 : 0.0252, 0.525 :0.0630, 0.55 :0.1263, 0.6 :0.2547, 0.8 :0.8489, 0.95 :1.6759, 0.975 :2.0086, 0.99 :2.4033 },
60  : { 0.51 : 0.0252, 0.525 :0.0630, 0.55 :0.1262, 0.6 :0.2545, 0.8 :0.8477, 0.95 :1.6706, 0.975 :2.0003, 0.99 :2.3901 },
70  : { 0.51 : 0.0252, 0.525 :0.0629, 0.55 :0.1261, 0.6 :0.2543, 0.8 :0.8468, 0.95 :1.6669, 0.975 :1.9944, 0.99 :2.3808 },
80  : { 0.51 : 0.0251, 0.525 :0.0629, 0.55 :0.1261, 0.6 :0.2542, 0.8 :0.8461, 0.95 :1.6641, 0.975 :1.9901, 0.99 :2.3739 },
90  : { 0.51 : 0.0251, 0.525 :0.0629, 0.55 :0.1260, 0.6 :0.2541, 0.8 :0.8456, 0.95 :1.6620, 0.975 :1.9867, 0.99 :2.3685 },
100 : { 0.51 : 0.0251, 0.525 :0.0629, 0.55 :0.1260, 0.6 :0.2540, 0.8 :0.8452, 0.95 :1.6602, 0.975 :1.9840, 0.99 :2.3642 },
'inf' : { 0.51 : 0.0251, 0.525 :0.0627, 0.55 :0.1257, 0.6 :0.2533, 0.8 :0.8416, 0.95 :1.6449, 0.975 :1.9600, 0.99 :2.3263, 0.995 : 2.576 }
}

t_dict = {
       1  :{ 0.9   :   3.078 , 0.95  : 6.314  ,0.975 : 12.706   , 0.98 :15.895 , 0.99  :31.821 , 0.995 : 63.657},
       2  :{ 0.9   :   1.886 , 0.95  : 2.920  ,0.975 :  4.303   , 0.98 : 4.849 , 0.99  : 6.965 , 0.995 :  9.925},
       3  :{ 0.9   :   1.638 , 0.95  : 2.353  ,0.975 :  3.182   , 0.98 : 3.482 , 0.99  : 4.541 , 0.995 :  5.841},
       4  :{ 0.9   :   1.533 , 0.95  : 2.132  ,0.975 :  2.776   , 0.98 : 2.999 , 0.99  : 3.747 , 0.995 :  4.604},
       5  :{ 0.9   :   1.476 , 0.95  : 2.015  ,0.975 :  2.571   , 0.98 : 2.757 , 0.99  : 3.365 , 0.995 :  4.032},
       6  :{ 0.9   :   1.440 , 0.95  : 1.943  ,0.975 :  2.447   , 0.98 : 2.612 , 0.99  : 3.143 , 0.995 :  3.707},
       7  :{ 0.9   :   1.415 , 0.95  : 1.895  ,0.975 :  2.365   , 0.98 : 2.517 , 0.99  : 2.998 , 0.995 :  3.499},
       8  :{ 0.9   :   1.397 , 0.95  : 1.860  ,0.975 :  2.306   , 0.98 : 2.449 , 0.99  : 2.896 , 0.995 :  3.355},
       9  :{ 0.9   :   1.383 , 0.95  : 1.833  ,0.975 :  2.262   , 0.98 : 2.398 , 0.99  : 2.821 , 0.995 :  3.250},
      10  :{ 0.9   :   1.372 , 0.95  : 1.812  ,0.975 :  2.228   , 0.98 : 2.359 , 0.99  : 2.764 , 0.995 :  3.169},
      11  :{ 0.9   :   1.363 , 0.95  : 1.796  ,0.975 :  2.201   , 0.98 : 2.328 , 0.99  : 2.718 , 0.995 :  3.106},
      12  :{ 0.9   :   1.356 , 0.95  : 1.782  ,0.975 :  2.179   , 0.98 : 2.303 , 0.99  : 2.681 , 0.995 :  3.055},
      13  :{ 0.9   :   1.350 , 0.95  : 1.771  ,0.975 :  2.160   , 0.98 : 2.282 , 0.99  : 2.650 , 0.995 :  3.012},
      14  :{ 0.9   :   1.345 , 0.95  : 1.761  ,0.975 :  2.145   , 0.98 : 2.264 , 0.99  : 2.624 , 0.995 :  2.977},
      15  :{ 0.9   :   1.341 , 0.95  : 1.753  ,0.975 :  2.131   , 0.98 : 2.249 , 0.99  : 2.602 , 0.995 :  2.947},
      16  :{ 0.9   :   1.337 , 0.95  : 1.746  ,0.975 :  2.120   , 0.98 : 2.235 , 0.99  : 2.583 , 0.995 :  2.921},
      17  :{ 0.9   :   1.333 , 0.95  : 1.740  ,0.975 :  2.110   , 0.98 : 2.224 , 0.99  : 2.567 , 0.995 :  2.898},
      18  :{ 0.9   :   1.330 , 0.95  : 1.734  ,0.975 :  2.101   , 0.98 : 2.214 , 0.99  : 2.552 , 0.995 :  2.878},
      19  :{ 0.9   :   1.328 , 0.95  : 1.729  ,0.975 :  2.093   , 0.98 : 2.205 , 0.99  : 2.539 , 0.995 :  2.861},
      20  :{ 0.9   :   1.325 , 0.95  : 1.725  ,0.975 :  2.086   , 0.98 : 2.197 , 0.99  : 2.528 , 0.995 :  2.845},
      21  :{ 0.9   :   1.323 , 0.95  : 1.721  ,0.975 :  2.080   , 0.98 : 2.189 , 0.99  : 2.518 , 0.995 :  2.831},
      22  :{ 0.9   :   1.321 , 0.95  : 1.717  ,0.975 :  2.074   , 0.98 : 2.183 , 0.99  : 2.508 , 0.995 :  2.819},
      23  :{ 0.9   :   1.319 , 0.95  : 1.714  ,0.975 :  2.069   , 0.98 : 2.177 , 0.99  : 2.500 , 0.995 :  2.807},
      24  :{ 0.9   :   1.318 , 0.95  : 1.711  ,0.975 :  2.064   , 0.98 : 2.172 , 0.99  : 2.492 , 0.995 :  2.797},
      25  :{ 0.9   :   1.316 , 0.95  : 1.708  ,0.975 :  2.060   , 0.98 : 2.167 , 0.99  : 2.485 , 0.995 :  2.787},
      26  :{ 0.9   :   1.315 , 0.95  : 1.706  ,0.975 :  2.056   , 0.98 : 2.162 , 0.99  : 2.479 , 0.995 :  2.779},
      27  :{ 0.9   :   1.314 , 0.95  : 1.703  ,0.975 :  2.052   , 0.98 : 2.158 , 0.99  : 2.473 , 0.995 :  2.771},
      28  :{ 0.9   :   1.313 , 0.95  : 1.701  ,0.975 :  2.048   , 0.98 : 2.154 , 0.99  : 2.467 , 0.995 :  2.763},
      29  :{ 0.9   :   1.311 , 0.95  : 1.699  ,0.975 :  2.045   , 0.98 : 2.150 , 0.99  : 2.462 , 0.995 :  2.756},
      30  :{ 0.9   :   1.310 , 0.95  : 1.697  ,0.975 :  2.042   , 0.98 : 2.147 , 0.99  : 2.457 , 0.995 :  2.750},
      40  :{ 0.9   :   1.303 , 0.95  : 1.684  ,0.975 :  2.021   , 0.98 : 2.123 , 0.99  : 2.423 , 0.995 :  2.704},
      50  :{ 0.9   :   1.299 , 0.95  : 1.676  ,0.975 :  2.009   , 0.98 : 2.109 , 0.99  : 2.403 , 0.995 :  2.678},
      60  :{ 0.9   :   1.296 , 0.95  : 1.671  ,0.975 :  2.000   , 0.98 : 2.099 , 0.99  : 2.390 , 0.995 :  2.660},
      70  :{ 0.9   :   1.294 , 0.95  : 1.667  ,0.975 :  1.994   , 0.98 : 2.093 , 0.99  : 2.381 , 0.995 :  2.648},
      80  :{ 0.9   :   1.292 , 0.95  : 1.664  ,0.975 :  1.990   , 0.98 : 2.088 , 0.99  : 2.374 , 0.995 :  2.639},
      90  :{ 0.9   :   1.291 , 0.95  : 1.662  ,0.975 :  1.987   , 0.98 : 2.084 , 0.99  : 2.368 , 0.995 :  2.632},
     100  :{ 0.9   :   1.290 , 0.95  : 1.660  ,0.975 :  1.984   , 0.98 : 2.081 , 0.99  : 2.364 , 0.995 :  2.626},
     200  :{ 0.9   :   1.286 , 0.95  : 1.653  ,0.975 :  1.972   , 0.98 : 2.067 , 0.99  : 2.345 , 0.995 :  2.601},
     'inf':{ 0.9   :   1.282 , 0.95  : 1.645  ,0.975 :  1.960   , 0.98 : 2.054 , 0.99  : 2.326 , 0.995 :  2.576},
}


var distribution;

var median;
var mean;
var quantile;

function log(str)  {
	console.log(str);
}

function parse_input(id) {
	value = document.getElementById(id).value;
	value = value.trim();
	value = value.replaceAll(',','.');
	value = value.split(seperator).filter(field => field !== "");
	value = value.map((v) => Number(v));
	value = value.filter(field => field !== " ");
	return value;
}


document.getElementById("ttest_dist1").addEventListener('keyup', ttest_2dist);
document.getElementById("ttest_dist2").addEventListener('keyup', ttest_2dist);
document.getElementById("lin_regx").addEventListener('keyup', linreg);
document.getElementById("lin_regy").addEventListener('keyup', linreg);

document.getElementById("distribution").addEventListener('keyup', calcStats);
document.getElementById("sigma_d").addEventListener('keyup', normal);
document.getElementById("mu_d").addEventListener('keyup', normal);
document.getElementById("normal_u").addEventListener('keyup', normal);
document.getElementById("normal_o").addEventListener('keyup', normal);
//window.setInterval(calcStats, 100);

function z_eval(z){
	if(! z) return 0;
	if(z < 0) return 1 - ss.cumulativeStdNormalProbability(Math.abs(z));
	else return ss.cumulativeStdNormalProbability(z);
}

function normal() {
	let div = document.getElementById('teil_a_res');
	while (div.firstChild) { div.firstChild.remove() }
	let p = document.createElement('p');

	let x = parse_input('mittelwert')[0];
	let S = parse_input('streuung')[0];
	let lower = parse_input('lower')[0];
	let upper = parse_input('upper')[0];

	let z_l = (lower - x) / S
	let z_u = (upper - x) / S

	let psi_l = z_eval(z_l);
	let psi_u = z_eval(z_u);

	p.innerText = psi_u - psi_l;
	div.appendChild(p);
}

function basicGraphic() {}
function calcStats() {
    	dist = parse_input('distribution');
	dist_abs  = dist.map((v) => Math.abs(v));
	logger = dist;

	document.getElementById('sort').innerText             = dist.sort((a,b) => a - b);
	document.getElementById('length').innerText                = dist.length;
	document.getElementById('mode').innerText             = ss.mode(dist);
	document.getElementById('quantile').innerText         = "0.25:  " + ss.quantile(dist, 0.25) + "   | 0.5: " + ss.quantile(dist, 0.5) + "   | 0.75: " + ss.quantile(dist, 0.75);
	document.getElementById('interquantile').innerText    = ss.quantile(dist, 0.75) - ss.quantile(dist, 0.25);
	document.getElementById('median').innerText           = ss.median(dist);
	document.getElementById('mean').innerText             = ss.mean(dist);
	document.getElementById('spannweite').innerText       = ss.max(dist) - ss.min(dist);
	document.getElementById('harmonic_mean').innerText    = ss.harmonicMean(dist_abs);
	document.getElementById('geometric_mean').innerText   = ss.geometricMean(dist_abs);
	document.getElementById('quadratic_mean').innerText   = ss.rootMeanSquare(dist);
	if(dist.length > 2) document.getElementById('schiefe').innerText          = ss.sampleSkewness(dist);
	document.getElementById('variance').innerText         = ss.variance(dist);
	if(dist.lenght > 1) document.getElementById('standard_deviaton').innerText = ss.sampleStandardDeviation(dist);
	if(dist.lenght > 1) document.getElementById('empiric_variance').innerText = ss.sampleVariance(dist_abs);
	document.getElementById('emp_streuung').innerText = Math.sqrt(ss.sampleVariance(dist));

	basicGraphic()
}

openTab(event, 'basic')
function openTab(evt, tab) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  content = document.getElementsByClassName("content");
  for (i = 0; i < content.length; i++) {
    content[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  sidebutton = document.getElementsByClassName("sidebutton");
  for (i = 0; i < sidebutton.length; i++) {
    sidebutton[i].className = sidebutton[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tab).style.display = "block";
  //evt.currentTarget.className += " active";
}

function t_button() {
}

function t_button_draw() {
	ctx.fillText(this.txt, this.x, this.y);
}

//t_test_init();

function t_test_draw() {
	ctx.font = '20px Arial'
	for(i in t_test_buttons) {
		t_test_buttons[i].draw();
	}
}

function t_test_init() {
	let button;
	canvas = document.getElementById('ttest_can');
	ctx = canvas.getContext('2d');
	let cols = Math.round(t_P.length + 1);
	let rows = Math.round(t_n.length + 1);
	let bw = canvas.width / t_P.length;
	let bh = canvas.height / t_n.length;
	for(let row = 0; row < cols; cols++) {
		for(let col = 0; col < cols; rows++) {
			button = new Button(col * bw, row * bw, bw, bh, t_button);
			if (row == 0) {
				button.txt = t_P[col]
			}
			else if (col == 0) {
				log(row);
				log(t_n[row]);
				button.txt = t_n[row];
			}
			else {
				button.txt = t_val[row * col];
		}
			button.draw = function() {
				ctx.fillText(this.txt, this.x, this.y);
			}
			t_test_buttons.push(button);
		}
	}
}

function gg(num) {
	return num.toString().replaceAll('.',',');
}

function generateRow(table, list) {
	let text = " ";
	let row = table.insertRow();
  	for (let elem of list) {
      		let cell = row.insertCell();
		cell.style.border = "solid 1px";
		try { 
			text = document.createTextNode(gg(elem)); 
		}
		catch { 
			log('NaN: ' + elem);
		}
      		cell.appendChild(text);
    	}
}

function tt(n, P) {
	keys = Object.keys(t_dict).map((k) => Number(k));
	if ( keys.includes(n) ) {
		log('included');
		return t_dict[n][P];
	}
	log('interpolated');

	let l = n;
	let u = n;
	while (! keys.includes(l)) l--;
	while (! keys.includes(u)) u++;
	return t_dict[l][P] + (n - l) * (t_dict[u][P] - t_dict[l][P]) / (u - l);
}

function ttest_2dist() {
	let dist1 = parse_input('ttest_dist1');
	let dist2 = parse_input('ttest_dist2');
	logger = dist1
	let n = dist1.length + dist2.length;
	document.getElementById('t_n').value = n;
	if(! n) return;
	let dist3 = [];
	let dist3_str = '';
	let data_length = (dist1.length >= dist2.length) ? dist1.length :dist2.length;

	let div = document.getElementById('ttest_vals');
	while (div.firstChild) { div.firstChild.remove() }
	let p = document.createElement("p");
	log(n)
	p.innerText = "t: " + tt(n,t_P);
	div.appendChild(p);
	p.innerText = "Ersatzgroesse: " + ss.tTestTwoSample(dist1, dist2, 0);
	div.appendChild(p);

	log(ss.tTestTwoSample(dist1, dist2, 0))
	log(tt(n,t_P))

	let head = [];
	for(let i = 1; i <= data_length; i++) {
		head.push(i);
	}

	let precision = Math.max(ss.max(dist1.concat(dist2).map((num) => num.toString().length - Math.round(num).toString().length - 1)),1);

	table = document.getElementById('ttest_dist_table');
	table.style.textAlign = "left";
	while (table.firstChild) { table.firstChild.remove() }

	generateRow(table, head)
	generateRow(table, dist1)
	generateRow(table, dist2)

	if(dist1.length === dist2.length) {
		for(i in dist1) {
			dist3[i] = (dist1[i] - dist2[i]).toFixed(precision);
			dist3_str += dist3[i];
			dist3_str += '  ';
		}
		dist3 = dist3.map((val) => Number(val));
		generateRow(table, dist3)
	}

	tab = document.getElementById('ttest_res_table');
	while (tab.firstChild) { tab.firstChild.remove() }
	dists = [dist1, dist2, dist3];
	for(func of [ss.mean, ss.sampleStandardDeviation]) {
	row = []
		for(dist of dists) {
			row.push(func(dist));
		}
	generateRow(tab, row);
	}

}

function ttest_P(P) {
	t_P = P;
	for(btn of document.getElementsByClassName('tpbtn')) {
		btn.style.backgroundColor = '';
	}
	ttest_2dist()
	document.getElementById(P).style.backgroundColor = '#393';
}
ttest_P(0.975);

function linreg() {
	let div = document.getElementById('lin_reg_res');
	while (div.firstChild) { div.firstChild.remove() }
	p = document.createElement('p');
	p2 = document.createElement('p');
	let x = parse_input('lin_regx');
	let y = parse_input('lin_regy');
	if(x.length != y.length) {
		p.innerText = "laenge ungleich";
		div.appendChild(p);
		return;
	}

	x = x.map((v) => v * Math.pow(10, parse_input('xscale')))
	y = y.map((v) => v * Math.pow(10, parse_input('yscale')))

	let points = [];

	for(i in x) {
		points[i] = [];
		points[i].push(x[i]);
		points[i].push(y[i]);
	}

	let nenner = 0;
	let zaehler = 0;
	let meanx = ss.mean(x);
	let meany = ss.mean(y);
	for(i in x) {
		log(x[i]);
		log(y[i]);
		nenner += (x[i] - meanx) * (y[i] - meany);
		zaehler += (x[i] - meanx) * (x[i] - meanx);
	}

	let b = nenner / zaehler;
	let a = meany - b * meanx;

	let res = ss.linearRegression(points);
	p.innerText = 'b: ' + b + '  a: ' + a;
	div.appendChild(p);
	p2.innerText = 'b: ' + res['m'] + '  a: ' + res['b'];
	div.appendChild(p2);
	logger = x;

}

function konfidenzintervall() {
	let div = document.getElementById('teil_a_res');
	while (div.firstChild) { div.firstChild.remove() }
	let p = document.createElement('p');
	let t = document.createElement('p');

	let mean = parse_input('mittelwert');
	let n =  parse_input('n_a')[0];
	let P = 1 - (1 - parse_input('P_a')[0])/2;
	let res = parse_input('streuung')[0] / Math.sqrt(n) * tt(n-1,P);

	t.innerText = gg('t_{' + n + '-1;' + P + '} = ' + tt(n-1,P));
	p.innerHTML = gg(mean + ' &plusmn; ' + res + ' : P = ' + parse_input('P_a'));
	div.appendChild(t);
	div.appendChild(p);
}

function stichprobenumfang_S() {
	let div = document.getElementById('teil_a_res');
	while (div.firstChild) { div.firstChild.remove() }
	let tab = document.createElement('table');
	let P = 1 - (1 - parse_input('P_a')[0])/2;
	let S = parse_input('streuung')[0];
	for(key of Object.keys(t_dict)) {
		generateRow(tab,[key, t_dict[key][P], S / Math.sqrt(key) * t_dict[key][P]]);
	}
	div.appendChild(tab);
}

function stichprobenumfang_sigma() {
	let div = document.getElementById('teil_a_res');
	while (div.firstChild) { div.firstChild.remove() }
	let tab = document.createElement('table');
	let P = 1 - (1 - parse_input('P_a')[0])/2;
	let sigma = parse_input('streuung')[0];
	for(key of Object.keys(t_dict)) {
		generateRow(tab,[key, t_dict['inf'][P], sigma / Math.sqrt(key) * t_dict['inf'][P]]);
	}
	div.appendChild(tab);
}

function tval() {
	let div = document.getElementById('teil_a_res');
	while (div.firstChild) { div.firstChild.remove() }
	let p = document.createElement('p');
	let t = document.createElement('p');

	let n =  parse_input('n_a')[0];
	let P = 1 - (1 - parse_input('P_a')[0])/2;

	t.innerText = gg('t_{' + n + '-1;' + P + '} = ' + tt(n-1,P));
	p.innerText = gg('t_{' + n + ';' + parse_input('P_a') + '} = ' + tt(n,parse_input('P_a')));
	div.appendChild(t);
	div.appendChild(p);
}
