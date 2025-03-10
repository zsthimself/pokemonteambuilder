const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

// 设置要获取的宝可梦数量（目前PokeAPI支持到第8代，约898个宝可梦）
const POKEMON_COUNT = 898;
// 设置输出文件路径
const OUTPUT_FILE = path.join(__dirname, '../data/updated-pokemon.json');

// 确保输出目录存在
fs.ensureDirSync(path.dirname(OUTPUT_FILE));

async function fetchPokemon(id) {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    
    const data = response.data;
    const speciesData = speciesResponse.data;
    
    // 获取中文名称（如果有）
    let chineseName = data.name;
    let englishName = data.name;
    
    if (speciesData.names && speciesData.names.length > 0) {
      const chineseNameObj = speciesData.names.find(name => name.language.name === 'zh-Hans' || name.language.name === 'zh-Hant');
      const englishNameObj = speciesData.names.find(name => name.language.name === 'en');
      
      if (chineseNameObj) {
        chineseName = chineseNameObj.name;
      }
      
      if (englishNameObj) {
        englishName = englishNameObj.name;
      }
    }
    
    // 获取世代信息
    const generation = parseInt(speciesData.generation.url.split('/').filter(Boolean).pop());
    
    // 构建宝可梦对象
    const pokemon = {
      id: data.id,
      name: chineseName,
      nameEn: englishName,
      types: data.types.map(type => type.type.name),
      generation: generation,
      sprite: `images/pokemon/${data.id}.png`,
      abilities: data.abilities.map(ability => 
        ability.ability.name.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      ),
      stats: {
        hp: data.stats.find(stat => stat.stat.name === 'hp').base_stat,
        attack: data.stats.find(stat => stat.stat.name === 'attack').base_stat,
        defense: data.stats.find(stat => stat.stat.name === 'defense').base_stat,
        spAttack: data.stats.find(stat => stat.stat.name === 'special-attack').base_stat,
        spDefense: data.stats.find(stat => stat.stat.name === 'special-defense').base_stat,
        speed: data.stats.find(stat => stat.stat.name === 'speed').base_stat
      }
    };
    
    return pokemon;
  } catch (error) {
    console.error(`Error fetching Pokemon #${id}:`, error.message);
    return null;
  }
}

async function fetchAllPokemon() {
  console.log(`开始获取${POKEMON_COUNT}个宝可梦的数据...`);
  
  const pokemonList = [];
  
  // 使用Promise.all批量处理请求，但限制并发数以避免API限制
  const batchSize = 10;
  
  for (let i = 0; i < POKEMON_COUNT; i += batchSize) {
    const batch = [];
    for (let j = 0; j < batchSize && i + j < POKEMON_COUNT; j++) {
      batch.push(fetchPokemon(i + j + 1));
    }
    
    console.log(`正在获取宝可梦 #${i + 1} 到 #${Math.min(i + batchSize, POKEMON_COUNT)}...`);
    const results = await Promise.all(batch);
    
    results.forEach(pokemon => {
      if (pokemon) {
        pokemonList.push(pokemon);
        console.log(`已获取 ${pokemon.nameEn} (#${pokemon.id})`);
      }
    });
    
    // 添加延迟以避免API速率限制
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 按ID排序
  pokemonList.sort((a, b) => a.id - b.id);
  
  // 写入文件
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(pokemonList, null, 2));
  console.log(`已成功获取${pokemonList.length}个宝可梦的数据并保存到 ${OUTPUT_FILE}`);
}

fetchAllPokemon().catch(error => {
  console.error('获取宝可梦数据时出错:', error);
});