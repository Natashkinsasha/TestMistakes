/*
 * Задача:
 * 1) Исправить ошибки в скрипте
 * 2) Оптимизировать его приведя в "красивый" вид
 * 3) Сократить потребление оперативной памяти
 * 4) Сократить время исполнения скрипта
 * 5) Посчитать комиссию, которую получит каждый бейкер с блока 832543 по 832546
 */
import axios from "axios";
import BPromise from "bluebird";
import range from "lodash.range";
import profile from "node-time-profile";
import nock from "nock";

const start = new Date().getTime();
const time = () => (new Date().getTime() - start) / 1000;
const address = "tz1TaLYBeGZD3yKVHQGBM857CcNnFFNceLYh";

type Content = {
  fee?: string;
};

type Transaction = {
  contents: Array<Content>;
};

type Block = {
  operations: Array<Array<Transaction>>;
};

class TezosBlockLoader {
  public static async load(number: number): Promise<Block> {
    return (
      await axios.get<Block>(
        "https://teznode.letzbake.com/chains/main/blocks/" + number
      )
    ).data;
  }
}

async function loadBlocks(): Promise<Array<Block>> {
  return BPromise.map(range(832543, 832546), async (number) => {
    return TezosBlockLoader.load(number);
  });
}

function getTransactions(blocks: Array<Block>): Array<Transaction> {
  return blocks
    .map((block) => {
      return block.operations.flat(1);
    })
    .flat(1);
}

function considerCommission(
  transactions: Array<Transaction>
): Record<string, number> {
  return transactions
    .map((transaction) => {
      return transaction.contents ?? [];
    })
    .flat(1)
    .map((content) => {
      return content.fee;
    })
    .reduce((tx_bakers_fees: Record<string, number>, fee) => {
      if (!fee) {
        return tx_bakers_fees;
      }
      if (!tx_bakers_fees[address]) {
        tx_bakers_fees[address] = 0;
      }
      tx_bakers_fees[address] += parseInt(fee);
      return tx_bakers_fees;
    }, {});
}

export default async (): Promise<{
  transactionsCount: number;
  bakers_fees: Record<string, number>;
  memory: number;
  time: number;
}> => {
  // Загружаем список необходмых блоков
  const blocks = await loadBlocks();

  // Получаем транзакции
  const transactions = getTransactions(blocks);

  // Считаем комиссии для бейкеров
  const bakers_fees = considerCommission(transactions);

  return {
    transactionsCount: transactions.length,
    bakers_fees,
    memory:
      Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
    time: time(),
  };
};
