/*
 * Задача:
 * 1) Исправить ошибки в скрипте
 * 2) Оптимизировать его приведя в "красивый" вид
 * 3) Сократить потребление оперативной памяти
 * 4) Сократить время исполнения скрипта
 * 5) Посчитать комиссию, которую получит каждый бейкер с блока 832543 по 832546
 */

const axios = require('axios');
const express = require('express');

const start = new Date().getTime();
const time = () => (new Date().getTime() - start)/1000;
const address = 'tz1TaLYBeGZD3yKVHQGBM857CcNnFFNceLYh';

class TezosBlock
{
    constructor(number){
        this.number = number;
        this.data = null;
    }
    async loadData(){ // Выгружаем данные из публичной ноды
        this.data = (await axios.get('https://teznode.letzbake.com/chains/main/blocks/'+this.number)).data;
    }
}

export default async () => {

    // Загружаем список необходмых блоков
    var list = [];
    for(let block = 832543; block < 832546; block++){
        let Block = new TezosBlock(block);
        await Block.loadData();
        list.push(Block.data);
    }

    // Получаем транзакции
    var transactions = [];
    let index = 0;
    while(list[index]){
        let batchs = list[index].operations;
        let batch, batch_index = 0;
        while((batch = batchs[batch_index]) && ++batch_index) batch.map(row => transactions.push(row));
        index++;
    }

    // Считаем комиссии для бейкеров
    let bakers_fees = {};
    let tx_index = 0;
    let tx;
    while((tx = transactions[tx_index]) && ++tx_index){
        if(!tx.contents) continue;
        tx.contents.map(row => {
            if(!row.fee) return;
            if(!bakers_fees[address]) bakers_fees[address] = 0;
            bakers_fees[address] += parseInt(row.fee);
        });
    }

    return {
        transactionsCount: transactions.length,
        bakers_fees,
        memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        time: time(),
    }
}


