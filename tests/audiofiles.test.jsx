import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'
import homophones from '../public/homophoneslist.json';
import fs from 'fs';
// import expect from 'jest';


/**
 * @jest-environment jsdom
 */
describe('Audio files list', () => {
  it('contains all valid files', () => {
    homophones.forEach(homophoneGroup => {
        const fileName = "./public/" + homophoneGroup.join("_") + ".mp3";
        console.log(fileName);
        expect(fs.existsSync(fileName)).toBe(true);
    });
    const notRealFile = "./public/fake.mp3";
    expect(fs.existsSync(notRealFile)).toBe(false);
  })
})