---
title: SVM 作业
date: 2022-10-26 15:02:34
tags: DL&ML
---



# Task 2 支持向量机 实验文档

## 问题思路

1. 使用软间隔SVM在给定的数据集上进行训练和测试。

2. 使用佩加索斯（Pegasos）算法近似求解SVM的目标函数。

3. 代码思路：

   1. 数据读取：读取 train 数据集和 test 数据集 （测试集样本数：1000；训练集样本数：4000）

      ```python
          train_x = train['X']  # 4000*1899
          train_y = train['y']  # 4000*1
          test_x = test['Xtest']  # 1000*1899
          test_y = test['ytest']  # 1000*1
      ```

   2. 计算 lambda：`lambda_ = 1 / (num_train * C)` 其中`num_train`是样本数量，`C`是惩罚参数。

   3. 初始化权重W和偏置b：

      ```python
          W = np.random.randn(num_features, 1)  # 1899*1
          b = np.random.randn(1)
      ```

   4. 使用佩加索斯算法，每次随机挑选一个样本进行参数估计：

      1. 使用 hinge损失
      2. 使用 指数损失
      3. 使用 对率损失

   5. 不断重复更新过程，直到循环结束。

   6. 计算准确率，画出目标函数曲线。



## 软间隔SVM理解

软间隔支持向量机引入松弛变量，优化问题为：
$$
\begin{aligned}
& \min _{w, b} w^{T} w / 2+C \sum_{i=1}^{n} \epsilon_{i} \\
s.t. \quad 
& y_{i}\left(w^{T} x_{i}+b\right) \geq 1-\epsilon_{i} \\
& \epsilon_{i} \geq 0
\end{aligned}
$$
利用hinge损失可以对松弛变量做更巧妙的表达：
$$
\epsilon_{i}=\left\{\begin{array}{ll}
0, & \text { if } y_{i}\left(w^{T} x_{i}+b\right) \geq 1 \\
1-y_{i}\left(w^{T} x_{i}+b\right), & \text { if } y_{i}\left(w^{T} x_{i}+b\right)<1
\end{array}\right.
$$

目标函数变为（更一般的形式 $ C = \frac{1}{n\lambda} $) ：
$$
\min _{w, b} f(w, b)=\frac{\lambda}{2}\|w\|^{2}+\frac{1}{n} \sum_{i=1}^{n} \max \left(0,1-y_{i}\left(w^{T} x_{i}+b\right)\right)
$$

### 使用佩加索斯算法求解问题

​	随机选择一个样本点的目标函数：
$$
f(w, b)=\frac{\lambda}{2}\|w\|^{2}+\max \left(0,1-y_{i}\left(w^{T} x_{i}+b\right)\right)
$$
​	分别对w和b求偏导，然后更新参数 w和b：
$$
\left[\begin{array}{l}
w_{t+1} \\
b_{t+1}
\end{array}\right]=\left[\begin{array}{l}
w_{t} \\
b_{t}
\end{array}\right]-\eta_{t}\left[\begin{array}{c}
\frac{\partial f}{\partial w}  \\
\frac{\partial f}{\partial b} 
\end{array}\right]
$$

### hinge 损失

hinge 损失:	$\ell_{\text {hinge }}(z)=\max (0,1-z)$

因为Hinge损失并非处处可导，所以需要情况讨论：

1. 若 $y_{i}\left(w^{T} x_{i}+b\right)<1$：

   目标函数:				$f(w, b)=\frac{\lambda}{2}\|w\|^{2}+\max \left(0,1-y_{i}\left(w^{T} x_{i}+b\right)\right)$

   对 w 求偏导：		$\frac{\partial f}{\partial w} = \lambda w-y_i x_i$

   对 b 求偏导： 		$\frac{\partial f}{\partial b} = -y_i $

2. 若 $y_{i}\left(w^{T} x_{i}+b\right) \ge 1$：

   目标函数:				$f(w, b)=\frac{\lambda}{2}\|w\|^{2}$

   对 w 求偏导：		$\frac{\partial f}{\partial w} = \lambda w$

   对 b 求偏导： 		$\frac{\partial f}{\partial b} = 0 $

### 指数损失

指数损失:				$\ell_{\text {exp}}(z)=\exp(-z)$

目标函数:				$f(w, b)=\frac{\lambda}{2}\|w\|^{2}+\exp(-y_{i}\left(w^{T} x_{i}+b\right))$

对 w 求偏导：		$\frac{\partial f}{\partial w} = \lambda w-y_i x_i \exp(-y_{i}\left(w^{T} x_{i}+b\right))$

对 b 求偏导： 		$\frac{\partial f}{\partial b} = -y_i \exp(-y_{i}\left(w^{T} x_{i}+b\right))$

### 对率损失

指数损失:				$\ell_{\text {exp}}(z)=\log(1+\exp(-z))$

目标函数:				$f(w, b)=\frac{\lambda}{2}\|w\|^{2}+\log(1+\exp(-y_{i}\left(w^{T} x_{i}+b\right)))$

对 w 求偏导：		$\frac{\partial f}{\partial w} = \lambda w- \frac{y_i x_i \exp(-y_{i}\left(w^{T} x_{i}+b\right))}{1+\exp(-y_{i}\left(w^{T} x_{i}+b\right))}$

对 b 求偏导： 		$\frac{\partial f}{\partial w} = - \frac{y_i \exp(-y_{i}\left(w^{T} x_{i}+b\right))}{1+\exp(-y_{i}\left(w^{T} x_{i}+b\right))}$

## 关键代码

### 1. 学习率 $\eta_t$ 的计算

学习率需要随着训练的次数不断的进行调整。具体公式为：
$$
\eta_t = \frac{1}{\lambda t}
$$
其中 $ \lambda = \frac{1}{nC} $, t 是当前迭代的次数。

```python
 for t in range(1, T+1):
        # TODO:写出eta_t的计算公式
        # 下降步长，逐渐减小
        eta_t = 1/(lambda_*t)
        ...
```



### 2. Hinge 损失

根据 `软间隔SVM理解` 中的求导结果：

```python
        if loss_type == 'hinge':
            # TODO:写出hinge_loss下的梯度更新公式
            # w: 1899 * 1  x: 1899 * 1
            st = y_i * (np.dot(W.T, x_i) + b)
            if st < 1:
                W = W - eta_t * (lambda_ * W - y_i * x_i)
                b = b + eta_t * y_i
            else:
                W = W - eta_t * (lambda_ * W)
```



### 3. 指数损失

```python
        elif loss_type == 'exp':
            exponent = -y_i * (np.dot(W.T, x_i) + b)[0]
            if exponent < 3:

                # TODO:写出exp_loss下的梯度更新公式

                W = W - eta_t * (lambda_ * W - y_i * x_i * np.exp(exponent))
                b = b + eta_t * y_i * np.exp(exponent)
```



### 对率损失

```python
        elif loss_type == 'log':
            # TODO:写出log_loss下的梯度更新公式
            exponent = -y_i * (np.dot(W.T, x_i) + b)[0]
            if exponent < 3:

                W = W - eta_t * (lambda_ * W + (- y_i * x_i * np.exp(exponent)) 
                                 /(1 + np.exp(exponent)))
                b = b + eta_t * (y_i * np.exp(exponent)) / (1 + np.exp(exponent))
```



> 注：
>
> ​		在指数损失和对率损失中存在指数操作，具有不稳定性，所以需要在计算指数之前对指数进行判断，当指数过大时，则跳过该样本。具体比较的值设置为3。$if -y_{i}\left(w^{T} x_{i}+b\right) < 3$

整体代码：

```python
def pegasos(train, test, C, T, loss_type='hinge', func_interval=100):

    train_x = train['X']  # 4000*1899
    train_y = train['y']  # 4000*1

    test_x = test['Xtest']  # 1000*1899
    test_y = test['ytest']  # 1000*1

    num_train = train_x.shape[0]  # 4000
    num_test = test_x.shape[0]  # 1000
    num_features = train_x.shape[1]  # 1899

    lambda_ = 1 / (num_train * C)

    # 高斯初始化权重W和偏置b
    W = np.random.randn(num_features, 1)  # 1899*1
    b = np.random.randn(1)

    func_list = []

    # 随机生成一组长度为T,元素范围在[0, num_train-1]的下标,供算法中随机选取训练样本
    choose = np.random.randint(0, num_train, T)

    for t in range(1, T+1):
        # TODO:写出eta_t的计算公式
        # 下降步长，逐渐减小
        eta_t = 1/(lambda_*t)

        # 随机选取的训练样本下标
        i = choose[t-1]
        x_i = train_x[[i]].T  # 1899*1
        y_i = train_y[i]  # 1

        if loss_type == 'hinge':
            # TODO:写出hinge_loss下的梯度更新公式
        elif loss_type == 'exp':
			# TODO:写出exp_loss下的梯度更新公式
        elif loss_type == 'log':
            # TODO:写出log_loss下的梯度更新公式
       	t += 1
        # 根据当前W和b,计算训练集样本的目标函数平均值
        if t % func_interval == 0:
            func_ = func(train_x, train_y, W, b, lambda_, loss_type)
            func_list.append(func_)
            print('t = %d, func = %.4f' % (t, func_))
            
    accuracy = 0
    for i in range(test_x.shape[0]):
        res = np.dot(W.T, test_x[i].T) + b
        if res >= 0 and test_y[i] == 1:
            accuracy += 1
        elif res < 0 and test_y[i] == -1:
            accuracy += 1

    accuracy = 100 * accuracy / num_test
    print('accuracy = %.1f%%' % accuracy)

    return accuracy, func_list
```



## 实验结果

每次测试8次，取结果最好的那次。尝试使用了3种loss：hinge、指数损失和对率损失。三种loss的结果均达到了 90% 以上。

### 1. hinge 损失的结果

使用的参数为 C=0.001， T = 10000，最终准确率 acc = 97.5%

<img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022172134881-21.png" alt="image-20221022172134881" style="zoom:50%;" />

### 2. 指数损失的结果

使用的参数为 C=0.001， T = 8000，最终准确率 acc = 97.2%

<img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022172017522-8a.png" alt="image-20221022172017522" style="zoom:50%;" />

### 3. 对率损失的结果

使用的参数为 C=0.001， T = 10000，最终准确率 acc = 94.7%

<img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022172248773-89.png" alt="image-20221022172248773" style="zoom:50%;" />



### 调整C、T参数：

#### 1. hinge 损失的结果

<img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022174518278-fe.png" alt="image-20221022174518278" style="zoom: 23%;" /><img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022174544510-ed.png" alt="image-20221022174544510" style="zoom: 23%;" /><img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022174614510-80.png" alt="image-20221022174614510" style="zoom: 23%;" /><img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022174633228-d0.png" alt="image-20221022174633228" style="zoom: 23%;" />

<img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022173744361-18.png" alt="image-20221022173744361" style="zoom: 40%;" />

表格中，行代表C的变化，列代表T的变化。T的变化对结果带来的影响比较小。而适当增大C有助于提高准确度。

C 是惩罚参数，C值大的时候对误分类的惩罚增大，C值小的时候对误分类的惩罚减小。

<img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022173855665-8c.png" alt="image-20221022173855665" style="zoom: 40%;" />

上图中，左图是固定T，改变C；右图是固定C，改变T。（由于使用随抽取样本，该结果存在一定的随机性）



#### 2. 指数损失的结果

<img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022174252760-ff.png" alt="image-20221022174252760" style="zoom:23%;" /><img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022174313581-f9.png" alt="image-20221022174313581" style="zoom:23%;" /><img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022174342048-21.png" alt="image-20221022174342048" style="zoom:23%;" /><img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022174413748-e7.png" alt="image-20221022174413748" style="zoom:23%;" />

<img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022173728559-25.png" alt="image-20221022173728559" style="zoom:40%;" />

表格中，行代表C的变化，列代表T的变化。T的变化对结果带来的影响比较小。而适当增大C有助于提高准确度。红色数据表明，模型将样本全部判定为负，训练失败。

<img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022173828788-04.png" alt="image-20221022173828788" style="zoom:40%;" />

上图中，左图是固定T，改变C；右图是固定C，改变T。（由于使用随抽取样本，该结果存在一定的随机性）



#### 3. 对率损失的结果

<img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022174802902-66.png" alt="image-20221022174802902" style="zoom:23%;" /><img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022174816280-90.png" alt="image-20221022174816280" style="zoom:23%;" /><img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022174831291-b9.png" alt="image-20221022174831291" style="zoom:23%;" /><img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022174849711-fd.png" alt="image-20221022174849711" style="zoom:23%;" />

<img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022173802271-dc.png" alt="image-20221022173802271" style="zoom:40%;" />

表格中，行代表C的变化，列代表T的变化。T的变化对结果带来的影响比较小。而适当增大C有助于提高准确度。红色数据表明，模型将样本全部判定为负，训练失败。

<img src="https://gcore.jsdelivr.net/gh/laptype/cloud@main/img/%E6%96%87%E6%A1%A3_img/20-04-884-image-20221022173909816-ed.png" alt="image-20221022173909816" style="zoom:40%;" />

上图中，左图是固定T，改变C；右图是固定C，改变T。（由于使用随抽取样本，该结果存在一定的随机性）





