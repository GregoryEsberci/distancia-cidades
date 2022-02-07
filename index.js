// dados: https://github.com/kelvins/Municipios-Brasileirosgi
const estados = require('./data/estados.json');
const municipios = require('./data/municipios.json');
const fs = require('fs');

const calcCrow = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
}


const toRad = (value) => value * Math.PI / 180;

// const estacao = municipios.find((v) => v.nome === 'Estação')
// const erechim = municipios.find((v) => v.nome === 'Erechim')

const obj = municipios.reduce((acc, municipio, index) => {
  const distancias = municipios
    .filter((v) => v.codigo_ibge !== municipio.codigo_ibge)
    .map((v) => calcCrow(v.latitude, v.longitude, municipio.latitude, municipio.longitude));

  acc[index] = {
    uf: estados.find((v) => v.codigo_uf === municipio.codigo_uf).nome,
    nome: municipio.nome,
    minDistancia: Math.min(...distancias),
  };

  return acc
}, []);

const result = obj.sort();

fs.writeFileSync('./data/output.json', JSON.stringify(result, undefined, 2));

console.log('10 cidade mais afastadas');
console.table(result.sort((a, b) => b.minDistancia - a.minDistancia).slice(0, 10));