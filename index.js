/*
 * Задача:
 * 1) Исправить ошибки в скрипте
 * 2) Оптимизировать его приведя в "красивый" вид
 * 3) Сократить потребление оперативной памяти
 * 4) Сократить время исполнения скрипта
 * 5) Посчитать комиссию, которую получит каждый бейкер с блока 832543 по 832546
 */

const axios = require('axios');
const BPromise = require('bluebird');
const range = require('lodash.range');

const start = new Date().getTime();
const time = () => (new Date().getTime() - start)/1000;
const address = 'tz1TaLYBeGZD3yKVHQGBM857CcNnFFNceLYh';

class TezosBlock {
  constructor(number){
    this.number = number;
    this.data = null;
  }
  async loadData(){ // Выгружаем данные из публичной ноды
    this.data = (await axios.get('https://teznode.letzbake.com/chains/main/blocks/'+this.number)).data;
  }
}

async function loadBlocks(){
  return BPromise
      .map(range(832543, 832546), async (block)=>{
        let Block = new TezosBlock(block);
        await Block.loadData();
        return Block.data
      })
      .reduce((list, data)=>{
        list.push(data);
        return list;
      }, [])
}

async function getTransactions(list){
  return BPromise.map(list, async (listItem)=>{
    const operations = listItem.operations;
    return BPromise.reduce(operations, (operationTransactions, operation)=>{
      operationTransactions.push(...operation)
      return operationTransactions;
    }, [])
  }).reduce((transactions, operationTransactions)=>{
    return [...transactions, ...operationTransactions];
  }, [])
}

async function considerCommission(transactions){
  return BPromise.reduce(transactions, async (bakers_fees, tx)=>{
    if(!tx.contents) {
      return bakers_fees;
    }
    return BPromise.reduce(tx.contents, (tx_bakers_fees, row)=>{
      if(!row.fee) {
        return tx_bakers_fees;
      }
      if(!tx_bakers_fees[address]) {
        tx_bakers_fees[address] = 0;
      }
      tx_bakers_fees[address] += parseInt(row.fee);
      return tx_bakers_fees;
    }, bakers_fees)
  }, {});
}

(async function(){

  // Загружаем список необходмых блоков
  const list = await loadBlocks();

  // Получаем транзакции
  const transactions = await getTransactions(list);

  // Считаем комиссии для бейкеров
  const bakers_fees = await considerCommission(transactions);

  // Выводим результат
  console.log('Count transactions', transactions.length);
  console.log('Bakers fees', bakers_fees);
  console.log('Memory (heapUsed, MB)', Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100);
  console.log('Time (seconds)', time());
})();
