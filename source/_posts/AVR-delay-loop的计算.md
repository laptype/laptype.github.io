---
title: AVR delay loop的计算
date: 2021-10-18 13:07:09
tags: AVR
---



AVR 精确延时loop 计算





- `LDI`: 1 clock cycle

- `DEC`: 1 clock cycle
- `NOP`: 1 clock cycle
- `LPM`: 3 clock cycle
- `BRNE`: 1 clock cycle if (Z == 0); 2 clock cycle if (Z != 0)



Example: 

```assembly
		LDI		R16,	100
L1:
		DEC		R16
		BRNE	L1
```

这个小循环

1. load R16 用 1 cycle
2. R16 从100减到0，一共计算100次，其中，99次计算结果不为0，`Z!=0`，BRNE用 2 cycle，1次计算结果为0，BRNE用 1 cycle。每次自减是 1 cycle。



$$
\begin{aligned}
	number\ of\ cycles & = LDI+(100-1)\times(BRNE_{(z!=0)}+DEC)+1\times(BRNE_{(z=0)}+DEC) \\
						& = 1+(100-1)\times(2+1)+1\times(1+1) \\
						& = 100\times3=300
\end{aligned}
$$



delay 1s: 

```assembly
    	ldi		r16, 	82
    	ldi		r17, 	43
    	ldi		r18, 	0
L1:		
	    dec		r18
    	brne	L1
    	dec		r17
    	brne	L1
    	dec		r16
    	brne	L1
    	lpm
    	nop
```



对于这个：
$$
\begin{aligned}
	n_{cycle} & = \underbrace{(256-1)\times3+2+1}_{r18从0自减到0}\\
	&+\underbrace{(43-1)\times(\overbrace{256\times3+2)}^{r18从0自减到0}+\overbrace{2+1}^{r17}}_{r17从43自减到0}\\
	&+\underbrace{(82-1)\times[(256\times3+2)\times256+2]+2+1}_{r16从82自减到0}\\
	&+3+1 \\
	&=16000000
\end{aligned}
$$


用时：
$$
\frac{1}{16MHz}*16000000 cycles = 1s
$$



怎么反推呢，知道时间，写代码？

http://darcy.rsgc.on.ca/ACES/TEI4M/AVRdelay.html

到着推的话，先算出82，再算出43，再算出256


$$
\frac{16000000}{(3\times256+2)\times256+2}+1 = 82.1680 \approx 82 \\
...\\
...
$$