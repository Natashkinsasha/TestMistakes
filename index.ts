import profile from "node-time-profile";
import nock from "nock";

import calculateNew from "./calculate-new";
import calculateOld from "./calculate-old";

// nock.disableNetConnect();
//
// nock("https://teznode.letzbake.com")
//   .persist()
//   .get(() => {
//     return true;
//   })
//   .delay(2000)
//   .reply(200, {
//     operations: [
//       [
//         {
//           contents: [
//             {
//               fee: 1,
//             },
//           ],
//         },
//       ],
//     ],
//   });

profile(
  () => {
    return calculateNew().then(
      ({ transactionsCount, bakers_fees, memory, time }) => {
        // Выводим результат
        console.log("-----new------");
        console.log("Count transactions", transactionsCount);
        console.log("Bakers fees", bakers_fees);
        console.log("Memory (heapUsed, MB)", memory);
        console.log("Time (seconds)", time);
        console.log("--------------");
      }
    );
  },
  { count: 1 }
).then((report) => {
  console.log("-----new------");
  console.log({ report });
  console.log("--------------");
});

// profile(
//   () => {
//     return calculateOld().then(
//       ({ transactionsCount, bakers_fees, memory, time }) => {
//         // Выводим результат
//         console.log("-----old------");
//         console.log("Count transactions", transactionsCount);
//         console.log("Bakers fees", bakers_fees);
//         console.log("Memory (heapUsed, MB)", memory);
//         console.log("Time (seconds)", time);
//         console.log("--------------");
//       }
//     );
//   },
//   { count: 1 }
// ).then((report) => {
//   console.log("-----old------");
//   console.log({ report });
//   console.log("--------------");
// });
