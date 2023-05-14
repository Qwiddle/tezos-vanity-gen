# Tezos Vanity Address Generator

A basic vanity address generator for tz1 addresses used on the Tezos Blockchain. 

It will generate a random key pair, and check the public key hash against the search term you provide. If a match is found, it will print the key pair to the console.

### Screenshots
![Code_Hky8ohh0qe](https://github.com/Qwiddle/tezos-vanity-gen/assets/24196928/ec23cdfb-cd71-49cb-805a-07115021ef2d)
![image](https://github.com/Qwiddle/tezos-vanity-gen/assets/24196928/72484381-18ae-47ed-aae2-21008290b1e8)

## Insallation

1. `git clone https://github.com/Qwiddle/tezos-vanity-gen.git`
2. `cd tezos-vanity-gen`
3. `yarn`

## Usage

`yarn start <search term> [-cs (case sensitive)]`

## Example

`yarn start Qwiddle -cs` will search for an address that starts with `tz1Qwiddle`


## Disclaimer

Not responsible for any lost funds. While it should be generally secure, I do not provide any guarantees of it's safety. Use at your own risk.
