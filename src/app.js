import Alpine from 'alpinejs'


Alpine.data('app', function () {
    return {
        init() {
            
        },
       
        gameStarted: false,
        points: 0,

        startGame() {
            this.gameStarted = true
            this.spawnEnemy()
            this.intervals.spawn()
            this.intervals.enemyMove()
            this.intervals.checkAttack()
            this.intervals.checkEnemyAttack()
        },

        player: {
            lives: 3,
            position: {
                top: 350,
                left: 350
            },
            direction: 'up',
            get orientation() {
                let rotate = {
                    up: 'rotate(0deg)',
                    down: 'rotate(180deg)',
                    left: 'rotate(270deg)',
                    right: 'rotate(90deg)'
                }
                return rotate[this.direction]
            }
        },

        enemies: [
        ],

        moveEnemy(enemy) {
            // determine direction towards player
            if (enemy.position.top > this.$data.player.position.top) {
                enemy.position.top -= 10
                enemy.direction = 'up'
            }
            if (enemy.position.top < this.$data.player.position.top) {
                enemy.position.top += 10
                enemy.direction = 'down'
            }
            if (enemy.position.left > this.$data.player.position.left) {
                enemy.position.left -= 10
                enemy.direction = 'left'
            }
            if (enemy.position.left < this.$data.player.position.left) {
                enemy.position.left += 10
                enemy.direction = 'right'
            }
        },

        isFacingEnemy(enemy) {
            let player = this.$data.player
            // If enemy position is within 30ox of player position
            if (enemy.position.top <= player.position.top + 50 && enemy.position.top >= player.position.top - 50) {
                // If enemy left is less than player left
                if (enemy.position.left <= player.position.left && player.direction === 'left') return true
                if (enemy.position.left >= player.position.left && player.direction === 'right') return true    
                if (enemy.position.top <= player.position.top && player.direction === 'up') return true
                if (enemy.position.top >= player.position.top && player.direction === 'down') return true
            }
            
            return false
        },

        weightedRandom(min, max) {
            return Math.round(max / (Math.random() * max + min));
        },

        isFacingPlayer(enemy) {
            let player = this.$data.player
            // If enemy position is within 30ox of player position
            if (player.position.top <= enemy.position.top + 50 && player.position.top >= enemy.position.top - 50) {
                // If enemy left is less than player left
                if (player.position.left <= enemy.position.left && enemy.direction === 'left') return true
                if (player.position.left >= enemy.position.left && enemy.direction === 'right') return true    
                if (player.position.top <= enemy.position.top && enemy.direction === 'up') return true
                if (player.position.top >= enemy.position.top && enemy.direction === 'down') return true
            }
            
            return false
        },

        attackedPlayer(enemy) {
            if (!this.isFacingPlayer(enemy)) return false
            if (this.weightedRandom(1,10) < 6) return false
            this.$data.player.lives--
            return true
        },

        spawnEnemy() {
            let enemy = {
                position: {
                    top: Math.floor(Math.random() * 640),
                    left: Math.floor(Math.random() * 640)
                },
                direction: 'right',
                get orientation() {
                    let rotate = {
                        up: 'rotate(0deg)',
                        down: 'rotate(180deg)',
                        left: 'rotate(270deg)',
                        right: 'rotate(90deg)'
                    }
                    return rotate[this.direction]
                },
                isAttacking: false
            }
            this.enemies.push(enemy)
        },

        controls: {
            up: () => {
                this.$data.player.direction = 'up'
                this.$data.player.position.top -= 10
            },
            down: () => {
                this.$data.player.direction = 'down'
                this.$data.player.position.top += 10
            },
            left: () => {
                this.$data.player.direction = 'left'
                this.$data.player.position.left -= 10
            },
            right: () => {
                this.$data.player.direction = 'right'
                this.$data.player.position.left += 10
            },
            attack: () => {
                this.$data.player.isAttacking = true
                setTimeout(() => {
                    this.$data.player.isAttacking = false
                }, 500)
                this.$data.swordNoise()
            }
        },

        trigger: {
            ['@keydown.up.window']() {
                this.controls.up()
            },
            ['@keydown.down.window']() {
                this.controls.down()
            },
            ['@keydown.left.window']() {
                this.controls.left()
            },
            ['@keydown.right.window']() {
                this.controls.right()
            },
            ['@keydown.space.window']() {
                this.controls.attack()
            }

        },

        swordNoise() {
            let swordSounds = [
                new Audio('audio/sword-1.mp3'),
                new Audio('audio/sword-2.mp3'),
                new Audio('audio/sword-3.mp3')
            ]
            swordSounds[Math.floor(Math.random() * swordSounds.length)].play()
        },
        
        /**
		 * Interval methods
		 */
        intervals: {
            IDs: [],
            spawn: ()=> {
                let interval = setInterval(() => this.$data.spawnEnemy(), 5000)
                this.$data.intervals.IDs.push(interval)
            },
            checkAttack: ()=> {
                let interval = setInterval(() => {
                    if (!this.$data.enemies.length) return
                    if (!this.$data.player.isAttacking) return
                    
                    this.$data.enemies.forEach(enemy => {
                        if (this.$data.isFacingEnemy(enemy)) {
                            // remove enemy
                            this.$data.points++
                            this.$data.enemies.splice(this.$data.enemies.indexOf(enemy), 1)
                        }
                    })
                }, 500)
                this.$data.intervals.IDs.push(interval) 
            },
            enemyMove: ()=> {
                let interval = setInterval(() => {
                    if (!this.$data.enemies.length) return

                    this.$data.enemies.forEach(enemy => this.$data.moveEnemy(enemy))
                }, 1000)
                this.$data.intervals.IDs.push(interval)
            },
            checkEnemyAttack: ()=> {
                let interval = setInterval(() => {
                    if (!this.$data.enemies.length) return
                    
                    this.$data.enemies.forEach(enemy => {
                        if (!this.$data.isFacingPlayer(enemy)) return
                        enemy.isAttacking = true
                        this.$data.attackedPlayer(enemy)
                        // this.$data.swordNoise()
                        setTimeout(() => {
                            enemy.isAttacking = false
                        }, 500)
                    })
                }, 500)
                this.$data.intervals.IDs.push(interval) 
            },
            clear() {
                this.IDs.forEach(id => clearInterval(id))
            },
        }
    }
});

window.Alpine = Alpine
Alpine.start()
